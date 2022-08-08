import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



/* Screens */
import StartScreen from './screens/StartScreen';
import NotificationScreen from './screens/NotificationScreen';

const Stack = createNativeStackNavigator()

export default function App() {

  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='NotificationScreen'>
        <Stack.Screen name="StartScreen" component={StartScreen} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen}
          options={{ headerShown: false, }}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


