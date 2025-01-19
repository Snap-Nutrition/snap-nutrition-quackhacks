import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard } from 'react-native';

export var calgoal = 2000;
export default function Settings() {
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [useMetric, setUseMetric] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('calorieGoal', calorieGoal);
      await AsyncStorage.setItem('useMetric', JSON.stringify(useMetric));
      calgoal = parseInt(calorieGoal);
      await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
      Alert.alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    Keyboard.dismiss();
  };

  const loadSettings = async () => {
    try {
      const savedCalorieGoal = await AsyncStorage.getItem('calorieGoal');
      calgoal = savedCalorieGoal;
      const savedNotificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');

      if (savedCalorieGoal !== null) setCalorieGoal(savedCalorieGoal);
      if (savedNotificationsEnabled !== null) setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.setting}>
        <Text style={styles.label}>Daily Calorie Goal</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter calorie goal"
          value={calorieGoal}
          onChangeText={setCalorieGoal}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.setting}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <Button color={"#007030"} title="Save Settings" onPress={saveSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});