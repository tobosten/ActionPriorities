import { View, Text, TouchableOpacity, Image, Dimensions, Animated, Easing } from 'react-native'
import React, { useRef } from 'react'
import borderShadow from "../assets/borderShadow"

const FAB = () => {

    const spinValue = useRef(new Animated.Value(0)).current;
    Animated.loop(
        Animated.timing(
            spinValue, {
            toValue: 1,
            duration: 3000,
            easing: Easing.cubic,
            useNativeDriver: true,
        }
        )
    ).start()
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"]
    })


    const windowHeight = Dimensions.get("window").height
    const windowWidth = Dimensions.get("window").width

    return (
        <TouchableOpacity style={[{ /* borderWidth: 1, */ 
        borderRadius: 100, 
        height: 70, width: 70, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#037ffc",
        marginLeft: windowWidth - 100
        }, borderShadow.depth6]}>
            <Animated.Image
                source={require("../assets/staticPlus.png")}
                style={[{ height: 30, width: 30, transform: [{ rotate: spin }] }, {}]}
            />
        </TouchableOpacity>
    )
}

export default FAB