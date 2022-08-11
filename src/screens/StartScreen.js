import { View, Text, TouchableOpacity, ImageBackground, Animated, Easing, Image } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import borderShadow from '../assets/borderShadow'

const StartScreen = ({ navigation }) => {

    const [blink, setBlink] = useState(false)


    /*  useEffect(() => {
         const interval = setInterval(() => {
 
             setBlink((blink) => setBlink(!blink))
         }, 700)
 
         return () => {
             clearInterval(interval)
         }
     }, []) */


    const rotateAnimation = useRef(new Animated.Value(0)).current;
    Animated.loop(
        Animated.timing(
            rotateAnimation, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true
        }
        )
    ).start()


    const spin = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })


    return (
        <View style={{ flex: 1, }}>
            <View style={{ alignItems: "center", flex: 1, justifyContent: "center", paddingBottom: 20 }}

            >
                <View style={[{
                    /* borderWidth: 1, */
                    alignItems: "center",
                    justifyContent: "center",
                    height: 200,
                    width: 200,
                    borderRadius: 100,
                    backgroundColor: "#0e8fe6"
                }, borderShadow.depth12]}>


                    <Text style={{
                        fontSize: 34, fontWeight: "500",
                        color: "white",
                        textShadowColor: "black",
                        textShadowOffset: { width: -.5, height: 1 },
                        textShadowRadius: 5,
                    }}>Action</Text>
                    <Text style={{
                        fontSize: 34, fontWeight: "500",
                        color: "white",
                        textShadowColor: "black",
                        textShadowOffset: { width: -.5, height: 1 },
                        textShadowRadius: 5,
                    }}>Reminder</Text>

                    <Animated.View
                        style={{ borderLeftWidth: 2, borderColor: "gray", height: 210, width: 210, position: "absolute", borderRadius: 500, transform: [{ rotate: spin }] }}
                    />
                </View>
            </View>

            <View style={[{ flex: .5, borderwidth: 1, }, {}]}>

                <TouchableOpacity style={[{
                    alignItems: "center",
                    justifyContent: "center",
                    /* borderWidth: 1, */
                    backgroundColor: "#0e8fe6",
                    width: "70%",
                    alignSelf: "center",
                    paddingVertical: 10,
                    borderRadius: 8,
                    flexDirection: "row"
                }, borderShadow.depth6]}
                    onPress={() => {
                        navigation.navigate("NotificationScreen")
                    }}
                >
                    <Text style={{ display: blink ? "none" : "flex", fontStyle: "italic", fontSize: 20, fontWeight: "500", color: "white", }}>To reminders</Text>
                   

                </TouchableOpacity>
            </View>

        </View>
    )
}

export default StartScreen