import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../Login&SignupScreens/LoginScreen'
import SignUpScreen from '../Login&SignupScreens/SignUpScreen'
import SignupNext from '../Login&SignupScreens/SignupNext'

const Stack = createNativeStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Next" component={SignupNext} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default AuthStack

const styles = StyleSheet.create({})