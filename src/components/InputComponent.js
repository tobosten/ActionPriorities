import { View, Text, TextInput } from 'react-native'
import React from 'react'

const InputComponent = ({ value, valueChange, title, viewStyle, inputStyle }) => {
    return (
        <View style={[{ /* marginTop: 30, */ width: "80%", }, viewStyle]}>
            <Text style={{ position: "absolute", backgroundColor: "white", zIndex: 10, marginLeft: 10, paddingHorizontal: 10 }}>{title}</Text>
            <View>
                <TextInput
                    value={value}
                    onChangeText={valueChange}
                    multiline={true}
                    style={[{ borderWidth: 1, marginVertical: 10, paddingHorizontal: 10, width: "100%", fontSize: 16,borderRadius: 3, textAlignVertical: "top", }, inputStyle]}
                    
                />
            </View>

        </View>
    )
}

export default InputComponent