import { Text, View, Button, TouchableOpacity, StyleSheet, FlatList, TextInput } from "react-native";
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Modal from "react-native-modal";
import CircularProgress from 'react-native-circular-progress-indicator';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Meal, Day } from '../classes';

export var days = [new Day(moment()), new Day(moment().subtract(1, 'days'))];

export default function Index() {
  // Form Data
  const [isModalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');


  const [calgoal, setCalgoal] = useState(0);
  const [index, setIndex] = useState(0);

  const [, forceUpdate] = useReducer(x => x + 1, 0);


    const loadSettings = async () => {
      // Loads data from AsyncStorage
      try {
        const savedCalorieGoal = await AsyncStorage.getItem('calorieGoal');
        const txt = await AsyncStorage.getItem('data');
        if (txt !== null) {
          const savesp = JSON.parse(txt).map(Day.fromJSON);
          days = savesp;
        }
        setCalgoal(parseInt(savedCalorieGoal != null ? savedCalorieGoal : "2000"));
        if (days[0].date.format("MMMM Do, YYYY") !== moment().format("MMMM Do, YYYY")) {
          days.unshift(new Day(moment()));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    useFocusEffect(
      useCallback(() => {
        forceUpdate();
      }, [])
    );
    useEffect(() => {
      // Load settings on component mount
      loadSettings();
  }, []);

  const toggleModal = () => {
    // Toggles the modal visibility
    setModalVisible(!isModalVisible);
  };

  const addMeal = () => {
    // Adds a meal to the current day
    days[index].addMeal(new Meal(days[index].meals.length + 1, mealName, parseInt(calories), parseInt(carbs), parseInt(protein), parseInt(fat)));
    console.log(days[index]);
    toggleModal();
    AsyncStorage.setItem('data', JSON.stringify(days.map(day => day.toJSON())));
  };
  const editMeal = (item: Meal) => {
    // Edits a meal
    setCalories(item.calories + "")
    setCarbs(item.carbs + "")
    setProtein(item.protein + "")
    setFat(item.fat + "")
    setMealName(item.title + "")
    toggleModal();
    deleteMeal(item);
  };
  const deleteMeal = (item: Meal) => {
    // Deletes a meal from the current day
    days[index].calories -= item.calories;
    days[index].carbs -= item.carbs;
    days[index].protein -= item.protein;
    days[index].fat -= item.fat;
    const ind = days[index].meals.findIndex((m: any) => m === item);
    days[index].meals.splice(ind, 1);
    forceUpdate();
  };
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <Text style={styles.date}>{days[index].date.format("MMMM Do, YYYY")}</Text>
      <Text style={styles.remaining}>
        Remaining = {calgoal - days[index].calories}
      </Text>
      <TouchableOpacity onPress={() => setIndex(index + 1)} disabled={index === days.length - 1} style={{
        position: 'absolute',
        left: 10,
        top: 10,
        zIndex: 1
      }}> 
      <FontAwesome name="arrow-left" size={35} color={index === days.length - 1 ? "black" : "#007030"}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIndex(index - 1)} disabled={index === 0} style={{
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1
      }}> 
      <FontAwesome name="arrow-right" size={35} color={index === 0 ? "black" : "#007030"}/>
      </TouchableOpacity>
      

      <CircularProgress
      value={days[index].calories / calgoal > 1 ? 1 : days[index].calories / calgoal}
      clockwise={false}
      activeStrokeWidth={30}
      inActiveStrokeWidth={30}
      activeStrokeColor={days[index].calories / calgoal > 1 ? "#FF6961" : '#007030'}
      radius={100}
      duration={0}
      maxValue={1}
      progressValueStyle={{fontSize:1, color: 'white'}}
      titleStyle={{fontWeight: 'bold'}}
    />
      <Text style={styles.circleText}>{days[index].calories + "\n"}cals</Text>
      
      {/* Meal Input Section */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Meal Name"
            placeholderTextColor={'#A9A9A9'}
            value={mealName}
            onChangeText={setMealName}
          />
          <TextInput
            style={styles.input}
            placeholder="Calories"
            placeholderTextColor={'#A9A9A9'}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Protein (g)"
            placeholderTextColor={'#A9A9A9'}
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Fat (g)"
            placeholderTextColor={'#A9A9A9'}
            value={fat}
            onChangeText={setFat}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Carbs (g)"
            placeholderTextColor={'#A9A9A9'}
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />
          <Button color="#007030" title="Add Meal" onPress={addMeal} />
          <Button color="#007030" title="Cancel" onPress={toggleModal} />
        </View>
      </Modal>
      <Button color="#007030" title="Add Meal Manually" onPress={toggleModal} />
      {/* Meal List Section */}
      <FlatList
      style={{ width: '100%', paddingTop: 2 }}
        data={days[index].meals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealName}>{item.title}</Text>
            <Text style={styles.mealDetail}>Calories: {item.calories}</Text>
            <Text style={styles.mealDetail}>Protein: {item.protein}g</Text>
            <Text style={styles.mealDetail}>Fat: {item.fat}g</Text>
            <Text style={styles.mealDetail}>Carbs: {item.carbs}g</Text>

            <TouchableOpacity onPress={() => editMeal(item)} style={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            zIndex: 1
            }}> 
            <FontAwesome name="pencil" size={35} color={index === 0 ? "black" : "#007030"}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteMeal(item)} style={{
            position: 'absolute',
            right: 60,
            bottom: 10,
            zIndex: 1
            }}> 
            <FontAwesome name="trash" size={35} color={index === 0 ? "black" : "#007030"}/>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const background = "#f0f0f0";
const textcolor = "#000000";
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: background,
      color: textcolor,
      alignItems: 'center',
    },
    date: {
      fontSize: 18,
      fontWeight: 'bold',
      color: textcolor,
      marginBottom: 10,
    },
    title: {
      fontSize: 16,
      color: textcolor,
      marginBottom: 5,
    },
    remaining: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
      color: textcolor,
    },
    circle: {
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: '#e0e0e0',
      justifyContent: 'center',
      alignItems: 'center',
    },
    circleText: {
      fontSize: 40,
      position: 'absolute',
      fontWeight: 'bold',
      height: 200,
      width:"100%",
      textAlign: 'center',
      top: 92,
      paddingTop: 45
    },
    info: {
      width: '100%',
      paddingHorizontal: 20,
      marginBottom: 30,
    },
    infoText: {
      fontSize: 16,
      marginBottom: 10,
      color: 'white',
    },
    bold: {
      fontWeight: 'bold',
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      position: 'absolute',
      bottom: 30,
    },
    navItem: {
      width: 50,
      height: 50,
      backgroundColor: '#e0e0e0',
      borderRadius: 25,
    },
    modalContent: {
      height: 400,
      backgroundColor: 'white',
      color: 'black',
      padding: 20,
      justifyContent: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    mealItem: {
      padding: 10,
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    mealName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: textcolor,
    },
    mealDetail: {
      fontSize: 16,
      color: textcolor,
    },
  });
