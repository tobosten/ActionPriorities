import { View, Text, TextInput } from 'react-native'
import React, { useContext } from 'react'
import { ColorModeContext } from '../ProjectContext'


const InputComponent = ({ value, valueChange, title, viewStyle, inputStyle }) => {

    const { darkMode } = useContext(ColorModeContext)

    return (
        <View style={[{ /* marginTop: 30, */ width: "80%", }, viewStyle]}>
            <Text style={{
                position: "absolute",
                backgroundColor: darkMode == true ? "#121212" : "white",
                zIndex: 10, marginLeft: 10, paddingHorizontal: 10,
                color: darkMode == true ? "#84789c" : "black"
            }}>{title}</Text>
            <View>
                <TextInput
                    value={value}
                    onChangeText={valueChange}
                    multiline={true}
                    keyboardAppearance={darkMode == true ? 'dark' : "default"}
                    style={[{
                        borderWidth: 1, borderColor: darkMode == true ? "#84789c" : "black", marginVertical: 10, paddingHorizontal: 10, width: "100%", fontSize: 16, borderRadius: 3, textAlignVertical: "top",
                        color: "#84789c"
                    }, inputStyle]}

                />
            </View>

        </View>
    )
}

export default InputComponent