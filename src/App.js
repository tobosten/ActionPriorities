import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProjectContextProvider } from './ProjectContext';



/* Screens */
import StartScreen from './screens/StartScreen';
import NotificationScreen from './screens/NotificationScreen';

const Stack = createNativeStackNavigator()

export default function App() {



  return (
    <ProjectContextProvider>
      <NavigationContainer>
        <Stack.Navigator /* initialRouteName='NotificationScreen' */>
          <Stack.Screen name="StartScreen" component={StartScreen}
            options={{ headerShown: false, }}
          />
          <Stack.Screen name="NotificationScreen" component={NotificationScreen}
            options={{ headerShown: false, }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ProjectContextProvider>

  );
}


