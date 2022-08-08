import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'

const StartScreen = ({ navigation }) => {

    const [blink, setBlink] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink((blink) => setBlink(!blink))
        }, 700)

        return () => {
            clearInterval(interval)
        }
    }, [])


    return (
        <View style={{ flex: 1, }}>
            <View style={{ alignItems: "center", borderWidth: 1, flex: 1, justifyContent: "center", paddingBottom: 20 }}>
                <Text style={{ fontSize: 28 }}>Action</Text>
                <Text style={{ fontSize: 28 }}>Reminder</Text>
            </View>
            <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                onPress={() => {
                    navigation.navigate("NotificationScreen")
                }}
            >
                <Text style={{ display: blink ? "none" : "flex", fontStyle: "italic", fontSize: 18 }}>Continue</Text>
            </TouchableOpacity>
        </View>
    )
}

export default StartScreen