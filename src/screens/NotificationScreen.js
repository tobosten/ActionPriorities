import { View, Text, Image, Dimensions, FlatList, Switch, Button, TouchableOpacity, Modal, TextInput, Animated, SafeAreaView, Alert, Touchable } from 'react-native'
import React, { useEffect, useState, useRef, useContext } from 'react'
import DatePicker from 'react-native-date-picker'
import Notifications from '../Notifications'
import borderShadow from '../assets/borderShadow'
import InputComponent from '../components/InputComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PushNotification from 'react-native-push-notification'
import moment from 'moment'
import { ColorModeContext } from '../ProjectContext'


const NotificationScreen = () => {

    const [date, setDate] = useState(new Date(Date.now()))
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const { darkMode, setDarkMode } = useContext(ColorModeContext)
    const [asyncDarkMode, setAsyncDarkMode] = useState(true)

    const [asyncStorageData, setAsyncStorageData] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [titleInput, setTitleInput] = useState("")
    const [messageInput, setMessageInput] = useState("")
    const [selectedTime, setSelectedTime] = useState("Select time")
    const [selectedTimeFull, setSelectedTimeFull] = useState("Select time")
    const [timeBool, setTimeBool] = useState(false)
    const [dailyRepeat, setDailyRepeat] = useState(false)
    const [listRefresh, setListRefresh] = useState(false)
    const [swipeMotion, setSwipeMotion] = useState(0)


    useEffect(() => {
        getData()
    }, [listRefresh])


    /* Checks if date is in the past. */
    function isInThePast(date) {
        const today = new Date();
        return date < today;
    }



    /* Sets notification */
    const scheduleNotification = (time) => {
        let id = ""
        asyncStorageData == null ? id = `${0}` : id = `${asyncStorageData.length}`

        /* Makes sure id is not duplicate */
        if (asyncStorageData != null) {
            asyncStorageData.forEach((item) => {
                /* console.log(item.id); */
                if (item.id == id) {
                    let pInt = parseInt(item.id)
                    id = `${pInt + 1}`
                    /* console.log("parsed ", id); */
                } else {
                    id = `${asyncStorageData.length}`
                }
            })
        }

        let object = {
            title: titleInput,
            message: messageInput,
            date: time,
            repeat: dailyRepeat == true ? "day" : "",
            id: `${id}`,
            active: true
        }

        Notifications.scheduleNotification(object)

        storeData(object)
        resetStates()
    }

    const resetStates = () => {
        setTitleInput("")
        setMessageInput("")
        setSelectedTime("Select time")
        setSelectedTimeFull("Select time")
        setTimeBool(false)
        setDailyRepeat(false)
    }

    /* Stores data to AsyncStorage */
    const storeData = async (object) => {
        let jsonValue = null

        try {
            /* Check if asyncStorageData is empty */
            if (asyncStorageData !== null) {
                jsonValue = JSON.stringify(
                    [...asyncStorageData,
                    {
                        title: object.title,
                        message: object.message,
                        date: object.date,
                        repeat: object.repeat,
                        id: object.id,
                        active: true
                    }]
                )
                await AsyncStorage.setItem("@storage_Key", jsonValue)
            } else if (asyncStorageData == null) {
                jsonValue = JSON.stringify(
                    [{
                        title: object.title,
                        message: object.message,
                        date: object.date,
                        repeat: object.repeat,
                        id: object.id,
                        active: true
                    }]
                )
                await AsyncStorage.setItem("@storage_Key", jsonValue)
            }

        } catch {
            console.log("Failed to store data");
        }
        setListRefresh(!listRefresh)
    }

    /* Gets data from AsyncStorage */
    const getData = async () => {
        try {
            let jsonValue = await AsyncStorage.getItem('@storage_Key')
            /* console.log("Getting Data", jsonValue) */
            setAsyncStorageData(JSON.parse(jsonValue))
        } catch (e) { }
    }





    function formatTime(time) {
        /* formats 1:8 to 01:08 */
        let date = time
        let hours = date.getHours().toString()
        let min = date.getMinutes().toString()
        let month = moment(time).format("MMM")
        let day = moment(time).format("Do")

        if (hours.length < 2) {
            hours = "0" + `${hours}`
        }
        if (min.length < 2) {
            min = "0" + `${min}`
        }

        setSelectedTime(`${hours} : ${min}`)
        setSelectedTimeFull(`${month} ${day} at ${hours} : ${min}`)
    }

    /* Update active value */
    const updateItemAsyncStorage = (id) => {
        /* console.log(id) */
        let array = [...asyncStorageData]

        array.forEach((item, index) => {
            if (item.id === id) {
                array[index].active == true ? array[index].active = false : array[index].active = true;
                /* console.log(item);
                console.log(array[index].active);
                console.log("Array: ", array); */

                if (array[index].active == true) {
                    PushNotification.scheduleLocalNotification({
                        id: item.id,
                        title: item.title,
                        message: item.message,
                        date: item.date,
                        repeat: item.repeat
                    })
                } else {
                    /* Cancel notif with the item id */
                    PushNotification.cancelLocalNotification({ id: `${item.id}` })
                }

                if (array[index].active == false) {

                }

                updateAsyncStorageArray(array)
            }
        })
    }


    /* Loops asyncStorageData to find correct notification */
    const removeItemAsyncStorageArray = (id) => {
        asyncStorageData.forEach((item) => {
            if (item.id == id) {
                Alert.alert(
                    "Remove reminder?",
                    "",
                    [
                        {
                            text: "No",
                            style: "cancel"
                        },
                        {
                            text: "Yes",
                            onPress: () => {
                                deleteItem(id)
                            }
                        }
                    ]
                );
            }
        })
    }

    /* Takes an id from an item and removes it. */
    const deleteItem = (id) => {
        const array = [...asyncStorageData]
        const result = array.filter(item => item.id !== id)
        console.log("Array", result);
        PushNotification.cancelLocalNotification({ id: `${id}` })
        updateAsyncStorageArray(result)
        console.log("Removed item id:", id);
    }

    /* Removes selected notification */
    const updateAsyncStorageArray = async (array) => {
        let jsonValue = null

        try {
            jsonValue = JSON.stringify(array)
            /* console.log("New data: ", jsonValue) */
            await AsyncStorage.setItem("@storage_Key", jsonValue)
            setListRefresh(!listRefresh)
        } catch { }
    }

    /* Render item for reminders */
    const renderItem = ({ item }) => {

        let newDate = moment(item.date)
        let day = newDate.format("Do")
        let month = newDate.format("MMM")
        let hours = newDate.format("h")
        let min = newDate.format("mm")

        hours.length < 2 ? hours = `0${hours}` : null;
        min.length < 2 ? min = `0${min}` : null;


        if (isInThePast(new Date(item.date)) == true) {
            if (item.repeat != "day") {
                deleteItem(item.id)
            }

        }
        return (
            <View style={[{ borderRadius: 8, width: "95%", alignSelf: "center", flexDirection: "row", backgroundColor: darkMode == true ? "#2e2e2e" : "white", marginVertical: 10 }, borderShadow.depth6]}
                onTouchStart={event => setSwipeMotion(event.nativeEvent.pageX)}
                onTouchEnd={event => {

                    if (swipeMotion - event.nativeEvent.pageX > 50) {
                        /* Swipe left motion > 50px */
                        /* console.log("Swiped left!");
                        console.log(event.nativeEvent.pageX); */
                        removeItemAsyncStorageArray(item.id)
                    }

                    if (swipeMotion - event.nativeEvent.pageX < 50) {
                        /* console.log("Right swipe"); */
                        updateItemAsyncStorage(item.id)
                    }

                }}
            >
                <View style={{ flex: 1, padding: 5, }}>
                    <Text style={{
                        marginLeft: 5, marginTop: 5, marginBottom: 5, fontSize: 17,
                        color: darkMode == true ? "#84789c" : "black"
                    }}>{item.title}</Text>
                    <View style={[{ padding: 5, margin: 5, borderRadius: 5, borderTopWidth: 1, borderColor: darkMode == true ? "#121212" : "gray" }]}>
                        <Text style={{ color: darkMode == true ? "#84789c" : "black" }}>{item.message}</Text>
                    </View>
                </View>

                <View style={{ width: 1, height: "70%", backgroundColor: darkMode == true ? "#121212" : "gray", alignSelf: "center" }} />

                {item.repeat == "day" ? (
                    <View style={{ flex: .3, justifyContent: "center", alignItems: "center" }}>
                        {item.active == true ? (
                            <View style={{ height: 10, width: 10, backgroundColor: "lightgreen", borderRadius: 10 }}></View>
                        ) : (
                            <View style={{ height: 10, width: 10, backgroundColor: "gray", borderRadius: 10 }}></View>
                        )}
                        <Text style={{ color: darkMode == true ? "#84789c" : "black" }}>Daily</Text>
                        <View style={{ marginVertical: 3, }} />
                        <Text style={{ color: darkMode == true ? "#84789c" : "black" }}>{`${hours}:${min}`}</Text>
                    </View>
                ) : (
                    <View style={{ flex: .3, justifyContent: "center", alignItems: "center" }}>
                        {item.active == true ? (
                            <View style={{ height: 10, width: 10, backgroundColor: "lightgreen", borderRadius: 10 }}></View>
                        ) : (
                            <View style={{ height: 10, width: 10, backgroundColor: "gray", borderRadius: 10 }}></View>
                        )}
                        <Text style={{ color: darkMode == true ? "#84789c" : "black" }}>{`${month} ${day}`}</Text>
                        <View style={{ marginVertical: 3, }} />
                        <Text style={{ color: darkMode == true ? "#84789c" : "black" }}>{`${hours}:${min}`}</Text>
                    </View>
                )
                }
            </View>
        )
    }





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode == true ? "#121212" : "#e8e8e8" }}>
            <View style={{ flex: 1, }}>
                <View style={{ flex: 0.1, }}>


                    <View style={[{
                        flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: darkMode == true ? "#121212" : "white", zIndex: 10
                    }, darkMode == true ? borderShadow.depth6White : borderShadow.depth6]}>
                        <Text style={{ marginLeft: 10, fontSize: 24, color: darkMode == true ? "#84789c" : "black" }}>Reminders</Text>
                        <TouchableOpacity style={{ marginLeft: "auto", marginRight: 20, marginVertical: 10, }}
                            onPress={() => {
                                Alert.alert(
                                    "Guide",
                                    `- Swipe left: Remove reminder \n- Swipe right: Activate/Deactivate`,
                                    [
                                        {
                                            text: "",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Thanks",
                                            onPress: () => {

                                            }
                                        }
                                    ]
                                );
                            }}>
                            <Image
                                source={darkMode == true ? require("../assets/darkMode/qMarkWhite.png") : require("../assets/qMarkBlack.png")}
                                style={{ height: 30, width: 30, margin: 5 }}
                            />
                        </TouchableOpacity>
                        {/*  <TouchableOpacity style={{ marginLeft: 10, marginRight: 20, marginVertical: 10 }}
                            onPress={() => { }}>
                            <Image
                                source={require("../assets/refreshImage.png")}
                                style={{ height: 40, width: 40 }}
                            />
                        </TouchableOpacity> */}
                    </View>
                </View>

                <View style={{ flex: 1.2, paddingTop: 20 }}>
                    <FlatList
                        data={asyncStorageData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index}
                        ListEmptyComponent={() => {
                            return (
                                <View style={{ borderColor: "white", paddingTop: "30%", alignItems: "center" }}>
                                    <Text style={{ color: darkMode == true ? "#84789c" : "gray", fontSize: 18 }}>You have no reminders yet</Text>
                                    <Image
                                        source={require("../assets/poro-shocked.png")}
                                        style={{ height: 60, width: 60, margin: 10 }}
                                    />
                                </View>

                            )
                        }}
                    />

                </View>
                {/* #037ff */}
                <View style={[{
                    flex: 0.2,
                    backgroundColor: darkMode == true ? "#121212" : "white",
                    justifyContent: "center",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderTopWidth: 1,
                    borderColor: darkMode == true ? "black" : "lightgray"
                }, borderShadow.depth24]}>
                    <TouchableOpacity style={[{
                        backgroundColor: darkMode == true ? "#84789c" : "#0e8fe6",
                        width: "80%",
                        alignSelf: "center",
                        paddingVertical: 15,
                        borderRadius: 5
                    }, borderShadow.depth6]} onPress={() => {
                        setModalOpen(!modalOpen)
                        setDate(new Date(Date.now()))
                    }}>
                        <Text style={{
                            textAlign: "center",
                            color: "white",
                            fontWeight: "500",
                            fontSize: 18,
                        }}>New Reminder</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType='slide'
                visible={modalOpen}
            >
                <View style={{ flex: 1, backgroundColor: darkMode == true ? "#121212" : "white" }}>
                    <View>
                        <Text style={{
                            fontSize: 22, marginTop: 20, marginLeft: 20,
                            color: darkMode == true ? "#84789c" : "black"
                        }}>New Reminder</Text>
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
                            backgroundColor: darkMode == true ? (timeBool == false ? "#2e2e2e" : "#84789c") : (timeBool == false ? "white" : "#037ffc"),
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
                            }}>
                            <Text style={{
                                fontSize: 18,
                                color: darkMode == true ? (timeBool == false ? "#84789c" : "white") : (timeBool == false ? "black" : "white"),
                                fontWeight: timeBool == false ? "400" : "600"
                            }}>{dailyRepeat == true ? selectedTime : selectedTimeFull}</Text>
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
                            backgroundColor: darkMode == true ? (dailyRepeat == false ? "#2e2e2e" : "#84789c") : (dailyRepeat == false ? "white" : "#037ffc"),
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
                                color: darkMode == true ? dailyRepeat == false ? "#84789c" : "white" : dailyRepeat == false ? "black" : "white",
                                fontWeight: dailyRepeat == false ? "400" : "600"
                            }}>Daily repeat</Text>
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
                            backgroundColor: darkMode == true ? "#84789c" : "white"
                        }, borderShadow.depth6]}
                            onPress={() => {
                                setModalOpen(!modalOpen)
                                resetStates()
                            }}>
                            <Text style={{ fontSize: 18, color: darkMode == true ? "white" : "black", fontWeight: darkMode == true ? "500" : "400" }}>Cancel</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={[{
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 5,
                            height: 50,
                            marginHorizontal: 5,
                            backgroundColor: darkMode == true ? "#84789c" : "white",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: titleInput && messageInput !== "" && selectedTime !== "Select time" ? "#84789c" : "#2e2e2e",
                        }, borderShadow.depth6]}
                            onPress={() => {
                                setModalOpen(!modalOpen)
                                scheduleNotification(date)

                            }}>
                            <Text style={{
                                fontSize: 18,
                                color: darkMode == true ? "white" : "black",
                                fontWeight: darkMode == true ? "500" : "400"
                            }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView >
    )
}


export default NotificationScreen