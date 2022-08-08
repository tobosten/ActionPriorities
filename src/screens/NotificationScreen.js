import { View, Text, Image, Dimensions, FlatList, Switch, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

import PersonTalking from '../components/PersonTalking'
import NotificationListEmpty from '../components/NotificationListEmpty'
import FAB from '../components/FAB'
import NotificationComponent from '../components/NotificationComponent'


const NotificationScreen = () => {

    const [emptyList, setEmptyList] = useState(true)
    let windowHeight = Dimensions.get("window").height



    let arr = [{
        note: "Breakfast",
        time: "09:00"
    }, {
        note: "Lunch",
        time: "13:00"
    }, {
        note: "Dinner",
        time: "19:00"
    },
    ]

    return (
        <View style={{ borderWidth: 1, flex: 1, }}>
            {emptyList == true ? (
                <View style={{ /* borderWidth: 1, *//*  alignItems: "center",  */ }}>

                    <Text style={{ fontSize: 22, marginTop: 20, marginLeft: 20 }}>Notifications</Text>

                    <View style={{ alignItems: "center", }}>
                        <FlatList
                            data={arr}
                            renderItem={(item, index) => {

                                return (
                                    <View style={{ borderWidth: 1, padding: 15, flexDirection: "row", borderRadius: 8, marginVertical: 10 }}>
                                        <NotificationComponent
                                            note={item.item.note}
                                            time={item.item.time}
                                        />
                                    </View>
                                )
                            }}
                            keyExtractor={(item, index) => index}
                            style={{ /* borderWidth: 1, */ width: "90%", marginTop: 20 }}
                        />
                    </View>



                </View>
            ) : (
                <View style={{ /* borderWidth: 1, */ flex: 1, alignItems: "center", }}>
                    <View style={{ borderWidth: 1, flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <NotificationListEmpty />
                    </View>

                    <View style={{ position: "absolute", marginTop: windowHeight - windowHeight * 0.2, /* borderWidth: 1, */ height: 20 }}>
                        <FAB />
                    </View>

                </View>
            )
            }
        </View >
    )
}


export default NotificationScreen