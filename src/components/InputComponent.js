import { View, Text, TextInput } from 'react-native'
import React from 'react'

const InputComponent = ({ value, valueChange, title }) => {
    return (
        <View style={{ marginTop: 30, width: "80%", }}>
            <Text style={{ position: "absolute", backgroundColor: "white", zIndex: 10, marginLeft: 10, paddingHorizontal: 10 }}>{title}</Text>
            <TextInput
                value={value}
                onChangeText={valueChange}
                style={{ borderWidth: 1, marginVertical: 10, paddingHorizontal: 10, width: "100%", alignSelf: "center", fontSize: 16, height: 40 }}
            />
        </View>
    )
}

export default InputComponent