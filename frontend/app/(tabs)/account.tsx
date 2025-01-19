import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { days } from './index';
import { Meal, Day } from '../classes';


const Profile = () => {
  const newData = () => {
    const txt = require("../test.json");
    const loaded = txt.map(day => Day.fromJSON(day));
    AsyncStorage.setItem('data', JSON.stringify(loaded));
  }
  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
        <FontAwesome5 name="user-circle" size={60} color="#555" />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>John Doe</Text>
          <Text style={styles.profileTag}>#64120056DS</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuContent}>
            <FontAwesome5 name="user" size={20} color="#555" />
            <Text style={styles.menuText}>My Profile</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => newData()} style={styles.menuItem}>
          <View style={styles.menuContent}>
            <FontAwesome5 name="bullseye" size={20} color="#555" />
            <Text style={styles.menuText}>Goals</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuContent}>
            <FontAwesome5 name="dumbbell" size={20} color="#555" />
            <Text style={styles.menuText}>Workouts</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/settings")} style={styles.menuItem}>
          <View style={styles.menuContent}>
            <FontAwesome5 name="cog" size={20} color="#555" />
            <Text style={styles.menuText}>Settings</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#555" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL("https://docs.google.com/forms/d/e/1FAIpQLSc1yyhIo2G9PX46eFyVfHIjkO4OFjx6rKL6Gtmval7PRDothQ/viewform")} style={styles.menuItem}>
          <View style={styles.menuContent}>
            <FontAwesome5 name="question-circle" size={20} color="#555" />
            <Text style={styles.menuText}>Help</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#555" />
        </TouchableOpacity>
      </View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileTag: {
    fontSize: 14,
    color: '#555',
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default Profile;
