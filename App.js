import React, { useState, useReducer, createContext, useContext } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import Helpers from './constants/Helpers';

const availabilityWithUpdate = (prevEvents, payload) => {
    const { date, hours, duration } = payload

    return [
        ...prevEvents,
        {
            date: new Date(date).setHours(hours),
            duration: duration
        }
    ]
}

const AvailabilityContext = createContext(null)
const useAvailability = () => useContext(AvailabilityContext)

const AvailabilityProvider = ({ children }) => {
    const [availabilityList, updateAvailability] = useReducer(availabilityWithUpdate, [])
    const [loading, setLoading] = useState(false)


    return (
        <AvailabilityContext.Provider
            value={{
                availabilityList,
                loading,
                setLoading,
                updateAvailability
            }}
        >
            {children}
        </AvailabilityContext.Provider>
    )
}

export const HoursList = ({ day, hasHours, hour }) => {
    const { updateAvailability } = useAvailability()

    return (
        hasHours ? (
            <View key={Helpers.getUniqueGuid()} style={{ borderColor: 'black', borderBottomWidth: 1, borderRightWidth: 1, height: 60 }}>
                <Text>{hour.hours}</Text>
            </View>
        ) : (
            <Pressable
                key={Helpers.getUniqueGuid()}
                onPress={() => updateAvailability({ date: day.date, hours: hour.hours.split(':')[0], duration: 1 })}
                style={{ borderColor: 'black', borderBottomWidth: 1, borderRightWidth: 1, height: 60 }}
            >
                <View style={{
                    borderColor: 'black',
                    borderBottomWidth: 1,
                    height: 30,
                }}>

                </View>
            </Pressable>
        )
    )
}

const AvailabilityView = () => {
    const daysOfWeek = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']

    const { availabilityList, loading } = useAvailability();

    const [headerHeight, setHeaderHeight] = useState(0)

    const currentWeek = new Date()

    const hoursList = new Array(24).fill(0).map((_, i) => ({ id: Helpers.getUniqueGuid(), hours: `${i < 10 ? '0' : ''}${i}:00` }))

    const dayList = new Array(7).fill(0).map((_, i) => {
        const test = currentWeek.getDay() + i
        return { id: Helpers.getUniqueGuid(), title: test + ' ' + daysOfWeek[i], date: new Date().setDate(test), hoursList: hoursList }
    })

    return (
        <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Text> </Text>

                    {hoursList.map((hour, index) => {
                        return <HoursList key={'hoursList_' + index} hasHours day={null} hour={hour} />
                    })}
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >

                    {dayList.map((day, index) => {
                        const availabilityForToday = availabilityList && availabilityList.filter(availability => new Date(day.date).getDate() === new Date(availability.date).getDate())

                        return (
                            <View key={'day_' + index} style={{ position: 'relative', width: 150 }}>
                                <View onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}>
                                    <Text>{day.title}</Text>
                                </View>


                                {headerHeight > 0 && availabilityForToday.map((availability, index) => {
                                    return <View key={'availability_' + index} style={{ backgroundColor: 'red', position: 'absolute', top: (new Date(availability.date).getHours() * 60) + headerHeight, height: 60, width: '100%' }}></View>
                                })}

                                {day.hoursList.map((hour, index) => {
                                    return <HoursList key={'hours_' + index} day={day} hasHours={null} hour={hour} />
                                })}
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        </ScrollView>
    )
}


const AvailabilityScreen = (props) => {
    return (
        <AvailabilityProvider>
            <AvailabilityView {...props} />
        </AvailabilityProvider>
    )
};

export default AvailabilityScreen;