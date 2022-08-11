import { View, Text, Image, Dimensions, FlatList, Switch, Button, TouchableOpacity, Modal, TextInput, Animated, SafeAreaView } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import NotificationListEmpty from '../components/NotificationListEmpty'
import FAB from '../components/FAB'
import NotificationComponent from '../components/NotificationComponent'
import DatePicker from 'react-native-date-picker'
import Notifications from '../Notifications'
import borderShadow from '../assets/borderShadow'
import InputComponent from '../components/InputComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'

import moment from 'moment'


const NotificationScreen = () => {

    const [emptyList, setEmptyList] = useState(true)
    let windowHeight = Dimensions.get("window").height

    const [date, setDate] = useState(new Date(Date.now()))
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const [asyncStorageData, setAsyncStorageData] = useState(null)

    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const [bgHidden, setBgHidden] = useState(true)
    const [displayNotifications, setDisplayNotifications] = useState(false)

    const [modalOpen, setModalOpen] = useState(false)
    const [titleInput, setTitleInput] = useState("")
    const [messageInput, setMessageInput] = useState("")
    const [selectedTime, setSelectedTime] = useState("Select time")
    const [timeBool, setTimeBool] = useState(false)
    const [dailyRepeat, setDailyRepeat] = useState(false)

    const scheduleNotification = (time) => {
        /* Can set multiple alarms */
        let daily = null
        dailyRepeat == true ? daily = "day" : null;
        Notifications.scheduleNotification({
            title: titleInput,
            message: messageInput,
            date: time,
            repeat: daily
        })

        setTitleInput("")
        setMessageInput("")
        setSelectedTime("Select time")
        setTimeBool(false)
        setDailyRepeat(false)
    }



    useEffect(() => {
        getData()
    }, [])

    if (displayNotifications == false) {
        if (asyncStorageData !== null) {
            setDisplayNotifications(true)

            /* console.log("async data: ", asyncStorageData[0].title); */
        }
    }

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem("@storage_Key", jsonValue)
        } catch (e) {

        }
    }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')
            setAsyncStorageData(JSON.parse(jsonValue))
        } catch (e) {
        }
    }

    /* 
        const fadeInFunction = () => {
            Animated.timing(
                fadeAnimation, {
                toValue: 0.5,
                duration: 500,
                useNativeDriver: true
            }
            ).start()
        }
    
        const fadeOutFunction = () => {
            Animated.timing(
                fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }
            ).start()
        } */


    function formatTime(time) {

        let date = time
        let hours = date.getHours().toString()
        let min = date.getMinutes().toString()

        if (hours.length < 2) {
            hours = "0" + `${hours}`
        }
        if (min.length < 2) {
            min = "0" + `${min}`
        }

        setSelectedTime(`${hours} : ${min}`)
    }



    return (
        <SafeAreaView style={{ flex: 1, }}>
            {bgHidden == false ? (
                <Animated.View style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "black", opacity: fadeAnimation }}></Animated.View>

            ) : (<></>)}
            <View style={{ borderWidth: 1, flex: 1, }}>

                <Text style={{ fontSize: 22, marginTop: 20, marginLeft: 20 }}>Notifications</Text>

                <View style={{ alignItems: "center", }}>

                    <TouchableOpacity style={[{
                        backgroundColor: "lightgray",
                        width: "80%",
                        height: 50,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 20,
                        zIndex: -10
                    }, borderShadow.depth6]}
                        onPress={() => {
                            setModalOpen(!modalOpen)
                            setBgHidden(!bgHidden)
                        }}>
                        <Text>Add new notification</Text>
                    </TouchableOpacity>


                    <Modal
                        animationType='slide'
                        visible={modalOpen}
                    >
                        <View style={{ flex: 1, }}>
                            <View>
                                <Text style={{ fontSize: 22, marginTop: 20, marginLeft: 20 }}>New notification</Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <InputComponent
                                    title={"Title"}
                                    value={titleInput}
                                    valueChange={setTitleInput}
                                    viewStyle={{ marginTop: 50 }}
                                    inputStyle={{ paddingVertical: 5, paddingTop: 15 }}
                                />

                                <InputComponent
                                    title={"Message"}
                                    value={messageInput}
                                    valueChange={setMessageInput}
                                    viewStyle={{ marginTop: 20 }}
                                    inputStyle={{ height: 100, paddingVertical: 5, paddingTop: 15 }}
                                />
                            </View>

                            <View style={{ alignItems: "center" }}>
                                <TouchableOpacity style={[{
                                    backgroundColor: timeBool == false ? "white" : "#037ffc",
                                    padding: 5,
                                    borderRadius: 8,
                                    marginTop: 20,
                                    width: "80%",
                                    height: 50,
                                    justifyContent: "center",
                                    alignItems: "center"
                                }, borderShadow.depth6]}
                                    onPress={() => {
                                        setDatePickerOpen(!datePickerOpen)
                                        setDate(new Date(Date.now()))
                                    }}>
                                    <Text style={{
                                        fontSize: 18,
                                        color: timeBool == false ? "black" : "white",
                                        fontWeight: timeBool == false ? "400" : "600"
                                    }}>{selectedTime}</Text>
                                </TouchableOpacity>

                                <DatePicker
                                    date={date}
                                    open={datePickerOpen}
                                    modal
                                    mode='datetime'
                                    is24hourSource='locale'
                                    onConfirm={(time) => {
                                        setDatePickerOpen(!datePickerOpen)
                                        formatTime(time)
                                        setDate(time)
                                        timeBool == false ? setTimeBool(true) : null
                                    }}
                                    onCancel={() => {
                                        setDatePickerOpen(!datePickerOpen)
                                    }}
                                />
                            </View>

                            <View style={{}}>
                                <TouchableOpacity style={[{
                                    padding: 5,
                                    backgroundColor: dailyRepeat == false ? "white" : "#037ffc",
                                    borderRadius: 8,
                                    marginTop: 20,
                                    width: 170,
                                    height: 50,
                                    alignItems: "center",
                                    marginLeft: "auto",
                                    marginRight: "10%",
                                    flexDirection: "row"
                                }, borderShadow.depth6]}
                                    onPress={() => {
                                        setDailyRepeat(!dailyRepeat)
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 18,
                                        textAlign: "center",
                                        width: "100%",
                                        color: dailyRepeat == false ? "black" : "white",
                                        fontWeight: dailyRepeat == false ? "400" : "600"
                                    }}>Daily repeat</Text>
                                    {/* <View style={{ width: 5, height: "90%", backgroundColor: dailyRepeat == false ? "white" : "#037ffc", borderRadius: 50, position: "absolute", marginLeft: 5, }} /> */}
                                </TouchableOpacity>
                            </View>


                            <View style={{ flexDirection: "row", marginTop: "15%", marginLeft: "auto", marginRight: "10%" }}>
                                <TouchableOpacity style={[{
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 5,
                                    height: 50,
                                    marginHorizontal: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "white"
                                }, borderShadow.depth6]}
                                    onPress={() => {
                                        setModalOpen(!modalOpen)
                                        setTitleInput("")
                                        setMessageInput("")
                                        setSelectedTime("Select time")
                                        setTimeBool(false)
                                        setDailyRepeat(false)
                                    }}>
                                    <Text style={{ fontSize: 18 }}>Cancel</Text>
                                </TouchableOpacity >
                                <TouchableOpacity style={[{
                                    paddingVertical: 10,
                                    paddingHorizontal: 15,
                                    borderRadius: 5,
                                    height: 50,
                                    marginHorizontal: 5,
                                    backgroundColor: "white",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }, borderShadow.depth6]}
                                    onPress={() => {
                                        setModalOpen(!modalOpen)
                                        scheduleNotification(date)

                                    }}>
                                    <Text style={{ fontSize: 18 }}>Confirm</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </Modal>

                    {displayNotifications == true ? (
                        <FlatList
                            data={asyncStorageData}
                            renderItem={(item, i) => {
                                return (
                                    <Text>{ }</Text>
                                )
                            }}
                            keyExtractor={(item, index) => index}
                        />
                    ) : (
                        <></>
                    )}

                    <View style={{ marginTop: 500 }}>
                        <Button
                            title="get async data"
                            onPress={() => {
                                getData()
                                console.log("storage data ", asyncStorageData);
                            }}
                        />
                    </View>


                </View>


            </View>

        </SafeAreaView >
    )
}


export default NotificationScreen