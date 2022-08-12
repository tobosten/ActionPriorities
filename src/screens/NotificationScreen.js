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
import PushNotification from 'react-native-push-notification'


const NotificationScreen = () => {

    const [date, setDate] = useState(new Date(Date.now()))
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const [asyncStorageData, setAsyncStorageData] = useState(null)
    const [displayNotifications, setDisplayNotifications] = useState(false)

    const [modalOpen, setModalOpen] = useState(false)
    const [titleInput, setTitleInput] = useState("")
    const [messageInput, setMessageInput] = useState("")
    const [selectedTime, setSelectedTime] = useState("Select time")
    const [timeBool, setTimeBool] = useState(false)
    const [dailyRepeat, setDailyRepeat] = useState(false)

    useEffect(() => {
        getData()
    }, [])


    if (displayNotifications == false) {
        if (asyncStorageData !== null) {
            setDisplayNotifications(true)

            /* console.log("async data: ", asyncStorageData[0].title); */
        }
    }

    const scheduleNotification = (time) => {
        /* Can set multiple alarms */
        let daily = null
        dailyRepeat == true ? daily = "day" : null;
        Notifications.scheduleNotification({
            title: titleInput,
            message: messageInput,
            date: time,
            repeat: daily,
            id: "10"
        })

        setTitleInput("")
        setMessageInput("")
        setSelectedTime("Select time")
        setTimeBool(false)
        setDailyRepeat(false)
    }


    const storeData = async (value) => {
        let arr = [{ title: "Title2", message: "Message2", date: new Date(), repeat: true, id: "2" }]
        try {
            /*  const jsonValue = JSON.stringify(value) */
            let data = null
            getData(data);
            console.log(data);

            /* const jsonValue = JSON.stringify(arr)
            console.log(jsonValue)
            await AsyncStorage.setItem("@storage_Key", jsonValue) */
        } catch (e) {

        }
    }

    const getData = async (data) => {
        try {
            const jsonValue = await AsyncStorage.getItem('@storage_Key')

            setAsyncStorageData(JSON.parse(jsonValue))
        } catch (e) {
        }
    }


    function formatTime(time) {
        /* formats 1:8 to 01:08 */
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

    console.log(asyncStorageData)


    const renderItem = ({ item }) => {

        return (
            <View style={{ borderWidth: 1, width: "80%", alignSelf: "center", flexDirection: "row" }}>
                <View style={{ flex: 1, paddingLeft: 10, borderWidth: 1, }}>
                    <Text style={{ fontStyle: "italic" }}>Title</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ fontSize: 20 }}>Title1</Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10, justifyContent: "center", borderWidth: 1, }}>
                    <Text style={{ fontStyle: "italic" }}>Message</Text>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginVertical: 3, }}>Message1Message1Message1</Text>
                </View>
                <View style={{ flex: 1, borderWidth: 1, }}>
                    <Text style={{ fontStyle: "italic" }}>Time</Text>
                    <Text style={{ fontSize: 20, alignSelf: "center" }}>10:00</Text>
                </View>
            </View >
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ borderWidth: 1, flex: 1, }}>
                <Button
                    title="cancel notification"
                    onPress={() => {
                        /* Notifications.cancelAllNotifications() */
                        /* Notifications.cancelLocalNotification("10") */
                        PushNotification.cancelLocalNotification("10")
                    }}
                />
                <View style={{ borderWidth: 1, padding: 5 }}>
                    <FlatList
                        data={asyncStorageData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                    />
                </View>


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
                        }}>
                        <Text>Add new notification</Text>
                    </TouchableOpacity>


                    <View style={{ marginTop: 200 }}>
                        <Button
                            title="get async data"
                            onPress={() => {
                                getData()
                                console.log("storage data ", asyncStorageData);
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Store data"
                            onPress={() => {
                                storeData()
                                console.log("Storing data", asyncStorageData);
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Remove item"
                            onPress={async () => {
                                await AsyncStorage.removeItem("@storage_Key")
                                console.log("storage data ", asyncStorageData);
                            }}
                        />
                    </View>


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



                </View>


            </View>

        </SafeAreaView >
    )
}


export default NotificationScreen