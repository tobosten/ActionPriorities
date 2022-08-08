import { View, Text, Image } from 'react-native'
import React from 'react'

const PersonTalking = () => {
    return (
        <View style={{ borderWidth: 1, backgroundColor: "white" }}>
            <Image
                source={require("../assets/speechBubble.gif")}
                style={{ height: 100, width: 100, marginLeft: 70,  }}
            />
            <Image
                source={require("../assets/personTalking.gif")}
                style={{ height: 100, width: 100 }}
            />
        </View>
    )
}

export default PersonTalking