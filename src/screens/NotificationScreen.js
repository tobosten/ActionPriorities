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
    const [selectedDate, setSelectedDate] = useState("")

    const scheduleNotification = (time) => {
        /* Can set multiple alarms */
        Notifications.scheduleNotification({
            title: "Title",
            message: "Message",
            date: time
        })
        /* console.log(time); */
    }



    useEffect(() => {
        getData()
    }, [])

    if (displayNotifications == false) {
        if (asyncStorageData !== null) {
            setDisplayNotifications(true)

            console.log("async data: ", asyncStorageData[0].title);
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
                            fadeInFunction()
                            setBgHidden(!bgHidden)
                        }}>
                        <Text>Add new notification</Text>
                    </TouchableOpacity>


                    <Modal
                        animationType='slide'
                        visible={modalOpen}
                        transparent={true}
                    >
                        <View style={{ height: "60%", width: "80%", alignSelf: "center", marginTop: "30%", backgroundColor: "white", alignItems: "center", borderRadius: 8 }}>
                            <InputComponent
                                title={"Title"}
                                value={titleInput}
                                valueChange={setTitleInput}
                            />
                            <InputComponent
                                title={"Message"}
                                value={messageInput}
                                valueChange={setMessageInput}
                            />
                        </View>
                        <View style={{ flexDirection: "row", marginLeft: "auto", marginRight: "10%", marginTop: 20, zIndex: 10 }}>
                            <TouchableOpacity style={{ borderWidth: 1, height: 40, width: 70, marginHorizontal: 10, justifyContent: "center", alignItems: "center", borderRadius: 8 }}
                                onPress={() => {

                                    fadeOutFunction()
                                    setModalOpen(!modalOpen)
                                    setTimeout(() => {
                                        setBgHidden(!bgHidden)
                                    }, 2000)

                                    setTitleInput("")
                                    setMessageInput("")
                                }}>
                                <Text >Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ borderWidth: 1, height: 40, width: 70, marginHorizontal: 10, justifyContent: "center", alignItems: "center", borderRadius: 8 }}
                                onPress={() => {
                                    let obj = [{ title: titleInput, msg: messageInput }]
                                    let object = [...obj, { title: "title", msg: "msg" },]
                                    storeData(object)

                                    setTitleInput("")
                                    setMessageInput("")
                                }}>
                                <Text>Confirm</Text>
                            </TouchableOpacity>
                        </View>

                    </Modal>

                    {displayNotifications == true ? (
                        <FlatList
                            data={asyncStorageData}
                            renderItem={(item, i) => {
                                return (
                                    <Text>{}</Text>
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



{/*  <TouchableOpacity style={[{
                                width: 150,
                                height: 40,
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                                marginTop: 50,
                                borderRadius: 8,
                                backgroundColor: "#037ffc"
                            }, borderShadow.depth6]}
                                onPress={() => { setDatePickerOpen(!datePickerOpen) }}>
                                <Text style={{ color: "white", fontWeight: "600" }}>Select date</Text>
                            </TouchableOpacity>
 */}
{/*    <DatePicker
                                modal
                                open={datePickerOpen}
                                date={date}
                                mode="datetime"
                                is24hourSource='locale'
                                onConfirm={(time) => {
                                    setDatePickerOpen(!datePickerOpen)
                                    setSelectedDate(time)
                                    
                                }}
                                onCancel={() => {

                                }}
                            /> */}


{/* <DatePicker
                                modal
                                open={open}
                                date={date}
                                mode="datetime"
                                is24hourSource="locale"
                                //textColor='blue'
                                onConfirm={(time) => {
                                    setOpen(!open)
                                    scheduleNotification(time)
                                }}
                                onCancel={() => { setOpen(!open) }}
 
                                /> */}



{/* <FlatList
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
                            style={{ width: "90%", marginTop: 20 }}
                        /> */}

{/*  <Button
                        title="Date picker"
                        onPress={() => {
                            setOpen(!open)
                            setDate(new Date(Date.now()))
                        }}
                    />

                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        mode="datetime"
                        is24hourSource="locale"
                        //textColor='blue'
                        onConfirm={(time) => {
                            setOpen(!open)
                            scheduleNotification(time)
                        }}
                        onCancel={() => { setOpen(!open) }}
                        
                    /> */}