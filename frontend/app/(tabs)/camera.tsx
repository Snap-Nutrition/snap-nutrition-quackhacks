// https://docs.expo.dev/versions/latest/sdk/camera/

import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import {ImageManipulator} from 'expo-image-manipulator';
import axios from 'axios';
import { router } from "expo-router";
import { days } from './index';
import { Meal, Day } from '../classes';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { backgroundcolor, urlroot } from "../global"
import * as ImagePicker from 'expo-image-picker';


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null)
  const [image, setImage] = useState<string>("");

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function pickPhoto() {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then((result) => {
      if (!result.cancelled) {
        console.log(result.assets[0].uri)
        setImage(result.assets[0].uri);
      }
    });
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  function toggleCameraFlash() {
    setFlash(current => (current === 'on' ? 'off' : 'on'));
  }
  function takePhoto() {
    const photo = ref.current.takePictureAsync().then((photo: any) => {
        console.log(photo.uri)
        setImage(photo.uri)
    })
  }
  const uploadPhoto = async () => {
    setLoading(true);
    try {
      const result = await ImageManipulator.manipulate(image);
      result.resize({ width: 512, height: 512 });
      const reference = await result.renderAsync()
      const saved = await reference.saveAsync()
      const formData = new FormData();
      formData.append('file', {
        uri: saved.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

    console.log('Uploading photo...');
    const response = await axios.post(
      urlroot + '/success',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
      
  
      const json = await response.data;
      console.log('Response JSON:', json);
      days[0].addMeal(new Meal(days[0].meals.length + 1, json.meal_title, json.calories, json.carbs, json.protein, json.fat));
      setImage("");
      router.back();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
        {loading && <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>}
        {image === "" ? (
        <CameraView style={styles.camera} flash={flash} facing={facing} pictureSize='' ref={ref} />
        ) : (
        <Image style={styles.camera} source={{ uri: image }} />
        )}
        {image === "" ? (
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
        <FontAwesome name="rotate-right" size={35} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.capture}>⦿</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFlash}>
        <FontAwesome name="flash" size={35} color={flash === "on" ? "yellow" : "#888"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.upload} onPress={pickPhoto}>
        <FontAwesome name="photo" size={35} color={"white"} />
        </TouchableOpacity>
      </View>
        ) : (
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setImage("")}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => uploadPhoto()}>
              <Text style={styles.text}>Upload</Text>
            </TouchableOpacity>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: backgroundcolor,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '100%',
    aspectRatio: 1
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    margin: "auto"
  },
  upload: {
    position: 'absolute',
    bottom: 0,
    left: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  capture: {
    fontSize: 200,
    color: 'white',
  },
  loading: {
    position: 'absolute',
    zIndex:50,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 24,
  },
});
