import { View, Text, Image, Dimensions, FlatList, Switch, Button, TouchableOpacity, Modal, TextInput, Animated, SafeAreaView, Alert, Touchable } from 'react-native'
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
import moment from 'moment'

const NotificationScreen = () => {

    const [date, setDate] = useState(new Date(Date.now()))
    const [datePickerOpen, setDatePickerOpen] = useState(false)

    const [asyncStorageData, setAsyncStorageData] = useState(null)

    const [modalOpen, setModalOpen] = useState(false)
    const [titleInput, setTitleInput] = useState("")
    const [messageInput, setMessageInput] = useState("")
    const [selectedTime, setSelectedTime] = useState("Select time")
    const [timeBool, setTimeBool] = useState(false)
    const [dailyRepeat, setDailyRepeat] = useState(false)
    const [listRefresh, setListRefresh] = useState(false)
    const [swipeMotion, setSwipeMotion] = useState(0)


    useEffect(() => {
        getData()
    }, [listRefresh])


    /* Sets notification */
    const scheduleNotification = (time) => {
        let id = ""
        asyncStorageData == null ? id = "0" : id = `${asyncStorageData.length}` // will get duplicate id if deleting

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
        setTitleInput("")
        setMessageInput("")
        setSelectedTime("Select time")
        setTimeBool(false)
        setDailyRepeat(false)
    }

    const resetStates = () => {
        setTitleInput("")
        setMessageInput("")
        setSelectedTime("Select time")
        setTimeBool(false)
        setDailyRepeat(false)
    }

    const storeData = async (object) => {
        /* Stores data to AsyncStorage */

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

                /* console.log("New data: ", jsonValue) */
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
                /* console.log("New data: ", jsonValue) */
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

        if (hours.length < 2) {
            hours = "0" + `${hours}`
        }
        if (min.length < 2) {
            min = "0" + `${min}`
        }

        setSelectedTime(`${hours} : ${min}`)
    }

    /* Update active value */
    const updateItemAsyncStorage = (id) => {
        console.log(id)
        let array = [...asyncStorageData]

        array.forEach((item, index) => {
            if (item.id === id) {
                array[index].active == true ? array[index].active = false : array[index].active = true;
                console.log(item);
                console.log(array[index].active);
                console.log("Array: ", array);

                if (array[index].active == true) {
                    PushNotification.scheduleLocalNotification({
                        id: item.id,
                        title: item.title,
                        message: item.message,
                        date: item.date,
                        repeat: item.repeat
                    })
                } else {
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
                    "Remove notification?",
                    "",
                    [
                        {
                            text: "No",
                            style: "cancel"
                        },
                        {
                            text: "Yes",
                            onPress: () => {
                                const array = [...asyncStorageData]
                                const result = array.filter(item => item.id !== id)
                                console.log("Array", result);
                                PushNotification.cancelLocalNotification({ id: `${id}` })
                                updateAsyncStorageArray(result)

                                console.log("Removed item id:", id);
                            }
                        }
                    ]
                );
            }
        })
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


    const renderItem = ({ item }) => {

        let newDate = moment(item.date)

        let day = newDate.format("Do")
        let month = newDate.format("MMM")
        let hours = newDate.format("HH")
        let min = newDate.format("MM")


        hours.length < 2 ? hours = `0${hours}` : null;
        min.length < 2 ? min = `0${min}` : null;



        return (
            <View style={[{ borderRadius: 8, width: "95%", alignSelf: "center", flexDirection: "row", backgroundColor: "white", marginVertical: 10 }, borderShadow.depth6]}
                onTouchStart={event => setSwipeMotion(event.nativeEvent.pageX)}
                onTouchEnd={event => {

                    if (swipeMotion - event.nativeEvent.pageX > 50) {
                        /* Swipe left motion > 50px */
                        console.log("Swiped left!");
                        console.log(event.nativeEvent.pageX);
                        removeItemAsyncStorageArray(item.id)
                    }

                    if (swipeMotion - event.nativeEvent.pageX < 50) {
                        console.log("Right swipe");
                        updateItemAsyncStorage(item.id)
                    }

                }}
            >

                <View style={{ flex: 1, padding: 5, }}>
                    <Text style={{ marginLeft: 5, marginTop: 5, marginBottom: 5, fontSize: 17 }}>{item.title}</Text>
                    <View style={[{ padding: 5, margin: 5, borderRadius: 5, borderTopWidth: 1, borderColor: "lightgray" }]}>
                        <Text>{item.message}</Text>
                    </View>
                </View>

                <View style={{ width: 1, height: "70%", backgroundColor: "lightgray", alignSelf: "center" }} />

                {item.repeat == "day" ? (
                    <View style={{ flex: .3, justifyContent: "center", alignItems: "center" }}>
                        {item.active == true ? (
                            <View style={{ height: 10, width: 10, backgroundColor: "lightgreen", borderRadius: 10 }}></View>
                        ) : (
                            <View style={{ height: 10, width: 10, backgroundColor: "gray", borderRadius: 10 }}></View>
                        )}
                        <Text style={{}}>Daily</Text>
                        <View style={{ marginVertical: 3, }} />
                        <Text>{`${hours}:${min}`}</Text>
                    </View>
                ) : (
                    <View style={{ flex: .3, justifyContent: "center", alignItems: "center" }}>
                        {item.active == true ? (
                            <View style={{ height: 10, width: 10, backgroundColor: "lightgreen", borderRadius: 10 }}></View>
                        ) : (
                            <View style={{ height: 10, width: 10, backgroundColor: "gray", borderRadius: 10 }}></View>
                        )}
                        <Text style={{}}>{`${month} ${day}`}</Text>
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
            <View style={{ flex: 1, }}>
                {/* <Button
                    title="cancel notification"
                    onPress={() => {
                        Notifications.cancelAllNotifications()
                        AsyncStorage.clear()
                        getData()
                    }}
                />

                <Button
                    title="Async storage data"
                    onPress={() => {
                        console.log("asyncStorageData:", asyncStorageData);
                    }}
                /> */}

                <View style={{ flex: 0.1, }}>

                    <View style={[{ flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "white", zIndex: 10 }, borderShadow.depth6]}>
                        <Text style={{ marginLeft: 10, fontSize: 24 }}>Notifications</Text>
                        <TouchableOpacity style={{ marginLeft: "auto", marginRight: 20, marginVertical: 10, }}
                            onPress={() => {
                                Alert.alert(
                                    "Guide",
                                    `- Swipe left: Remove notification \n- Swipe right: Activate/Deactivate`,
                                    [
                                        {
                                            text: "No",
                                            style: "cancel"
                                        },
                                        {
                                            text: "Yes",
                                            onPress: () => {

                                            }
                                        }
                                    ]
                                );
                            }}>
                            <Image
                                source={require("../assets/questionMarkImage.png")}
                                style={{ height: 30, width: 30 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 10, marginRight: 20, marginVertical: 10 }}
                            onPress={() => { }}>
                            <Image
                                source={require("../assets/refreshImage.png")}
                                style={{ height: 40, width: 40 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flex: 1.2, paddingTop: 20 }}>
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
                    }, borderShadow.depth6]} onPress={() => {
                        setModalOpen(!modalOpen)
                        setDate(new Date(Date.now()))
                    }}>
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
                                /* setDate(new Date()) */
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
                                resetStates()
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
        </SafeAreaView >
    )
}


export default NotificationScreen