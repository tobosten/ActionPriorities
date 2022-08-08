import { View, Text, Switch } from 'react-native'
import React, { useState } from 'react'

const NotificationComponent = ({ note, time }) => {

    const [isEnabled, setisEnabled] = useState(false)

    return (
        <>
            <View style={{ flex: 1, }}>
                <Text style={{ fontSize: 14, fontStyle: "italic" }}>Note</Text>
                {/* Pressable for card popup? */}
                <Text style={{ fontSize: 18 }}>{note}</Text>
            </View>

            <View style={{ width: 1, height: "80%", alignSelf: "center", backgroundColor: "lightgray" }} />

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 14, fontStyle: "italic", marginRight: 10 }}>Time</Text>
                <Text style={{ fontSize: 18 }}>{time}</Text>
            </View>

            <View style={{ width: 1, height: "80%", alignSelf: "center", backgroundColor: "lightgray" }} />

            <View style={{ flex: .5, alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                {/* Switch to enable notification */}
                <Switch
                    value={isEnabled}
                    onValueChange={setisEnabled}
                    trackColor={{ false: "lightgray", true: "#037ffc" }}
                    thumbColor={isEnabled ? "#0268cf" : "gray"}
                />
            </View></>
    )
}

export default NotificationComponent