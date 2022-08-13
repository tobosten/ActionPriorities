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


    const [listRefresh, setListRefresh] = useState(false)

    useEffect(() => {
        getData()

    }, [listRefresh])


    if (displayNotifications == false) {
        if (asyncStorageData !== null) {
            setDisplayNotifications(true)
        }
    }

    const scheduleNotification = (time) => {
        /* Can set multiple alarms */
        let daily = null
        let id = "1"
        dailyRepeat == true ? daily = "day" : null;
        /* asyncStorageData == null ? id == "0" : id == `${asyncStorageData.length + 1}` */

        let object = {
            title: titleInput,
            message: messageInput,
            date: time,
            repeat: daily,
            id: `${id}`
        }

        Notifications.scheduleNotification({
            title: object.title,
            message: object.message,
            date: time,
            repeat: object.daily,
            id: object.id
        })

        storeData(object)
        setTitleInput("")
        setMessageInput("")
        setSelectedTime("Select time")
        setTimeBool(false)
        setDailyRepeat(false)
    }


    const storeData = (object) => {
        /* Needs refresh button for async list to update in notification screen atm. */

        let jsonValue = null

        try {
            jsonValue = JSON.stringify(
                [...asyncStorageData,
                {
                    title: object.title,
                    message: object.message,
                    date: object.date,
                    repeat: object.daily,
                    id: object.id
                }]
            )
            console.log("Storing data: ", jsonValue)
            AsyncStorage.setItem("@storage_Key", jsonValue)
        } catch {
            jsonValue = JSON.stringify([object])

            console.log("Storing data: ", jsonValue)
            AsyncStorage.setItem("@storage_Key", jsonValue)
        }
    }

    const getData = async () => {
        try {
            let jsonValue = await AsyncStorage.getItem('@storage_Key')
            console.log("Getting Data: ", jsonValue)
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


    const renderItem = ({ item }) => {
        let monthArray = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "Novermber", "December"]
        let newDate = new Date(item.date)

        let day = newDate.getDay()
        let month = newDate.getMonth()
        let hours = newDate.getHours()
        let min = newDate.getMinutes()

        return (
            <View style={[{ /* borderWidth: 1, */borderRadius: 8, width: "95%", alignSelf: "center", flexDirection: "row", backgroundColor: "white", marginVertical: 10 }, borderShadow.depth6]}>

                <View style={{ /* borderWidth: 1,  */flex: 1, padding: 5, }}>
                    <Text style={{ marginLeft: 5, marginTop: 5, marginBottom: 5, fontSize: 17 }}>{item.title}</Text>
                    <View style={[{ padding: 5, margin: 5, borderRadius: 5, borderTopWidth: 1, borderColor: "lightgray" }]}>
                        <Text>{item.message}</Text>
                    </View>
                </View>

                <View style={{ width: 1, height: "70%", backgroundColor: "lightgray", alignSelf: "center" }} />

                {item.repeat == true ? (
                    <View style={{ /* borderWidth: 1, */ flex: .3, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{}}>Daily</Text>
                        <View style={{ marginVertical: 3, }} />
                        <Text>{`${hours}:${min}`}</Text>
                    </View>
                ) : (
                    <View style={{ /* borderWidth: 1, */ flex: .3, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{}}>{`${monthArray[month]} ${day}`}</Text>
                        <View style={{ marginVertical: 3, }} />
                        <Text>{`${hours}:${min}`}</Text>
                    </View>
                )
                }
            </View>
        )
    }

    let windowWidth = Dimensions.get("window").width
    let windowHeight = Dimensions.get("window").height
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ /* borderWidth: 1,  */flex: 1, }}>

                <Button
                    title="cancel notification"
                    onPress={() => {
                        Notifications.cancelAllNotifications()
                        AsyncStorage.clear()
                        /* PushNotification.cancelLocalNotification("2") */
                    }}
                />

                <Button
                    title="Async storage data"
                    onPress={() => {
                        getData()

                    }}
                />

                <View style={{ flex: 0.1, }}>

                    <View style={[{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "white", zIndex: 10 }, borderShadow.depth6]}>
                        <Text style={{ marginLeft: 10, fontSize: 24 }}>Notifications</Text>
                        <TouchableOpacity style={{ marginLeft: "auto", marginRight: 20, marginVertical: 10 }}
                            onPress={() => { }}>
                            <Image
                                source={require("../assets/refreshImage.png")}
                                style={{ height: 40, width: 40 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1.2, }}>
                    <FlatList
                        data={asyncStorageData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                    />
                </View>


                <View style={[{ flex: 0.2, backgroundColor: "white", justifyContent: "center", borderTopLeftRadius: 10, borderTopRightRadius: 10, borderTopWidth: 1, borderColor: "lightgray" }, borderShadow.depth24]}>


                    <TouchableOpacity style={[{
                        backgroundColor: "#037ffc",
                        width: "80%",
                        alignSelf: "center",
                        paddingVertical: 15,
                        borderRadius: 5
                    }, borderShadow.depth6]} onPress={() => { setModalOpen(!modalOpen) }}>
                        <Text style={{
                            textAlign: "center",
                            color: "white",
                            fontWeight: "500",
                            fontSize: 18
                        }}>New Notification</Text>
                    </TouchableOpacity>


                </View>
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
                                setListRefresh(!listRefresh)
                            }}>
                            <Text style={{ fontSize: 18 }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}


export default NotificationScreen