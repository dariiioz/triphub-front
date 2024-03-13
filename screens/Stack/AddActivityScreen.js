import { SafeAreaView } from 'react-native-safe-area-context';
import {View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { PlusCircle, MinusCircle, Navigation } from 'lucide-react-native';
import { useState } from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')
import { initTrips } from '../../reducers/users';

export default function AddActivityScreen( {navigation}) {
    const selectedDay = useSelector((state) => state.user.value.selectedDay.day)
    const selectedDate = useSelector((state) => state.user.value.selectedDay.date)
    const selectedTrip = useSelector((state) => state.user.value.selectedTripId)
    const token = useSelector((state) => state.user.value.user.token)

    const [title, setTitle] = useState('')
    const [hour, setHour] = useState('Heure')
    const [address, setAddress] = useState('')
    const [note, setNote] = useState([''])
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [hourSelected, setHourSelected] = useState(false)
    const [date, setDate] = useState(null)
    const [showAlertTitle, setShowAlertTitle] = useState(false)
    const [showAlertHour, setShowAlertHour] = useState(false)
    const [showAlertAddress, setShowAlertAddress] = useState(false)

    const allFieldsFilled = title !== '' && hour !== 'Heure' && address !== ''

    const dispatch = useDispatch()

    const showDatePicker = () => {
        setDatePickerVisibility(true)
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    }

    const handleConfirm = (date) => {
        //console.log("A date has been picked: ", date);
        setDate(date)
        const formattedDate = moment(date).format('LT')
        setHour(formattedDate)
        setHourSelected(true)
        hideDatePicker();
    }

    const handleInputChange = (text, index) => {
        const newNote = [...note]
        newNote[index] = text
        setNote(newNote)
    }

    const addInput = () => {
        setNote([...note, ''])
    }

    const removeInput = (index) => {
        const newNote = [...note]
        newNote.splice(index, 1)
        setNote(newNote)
    }

    const displayNotes = note.map((value, i) => {
        return (
            <View key={i} className='flex-row w-full items-center mb-4'>
                <TextInput className='h-14 border-[#ccc] border-2 bg-[#F2F4F5] rounded-lg pl-4 w-5/6 mr-4'
                placeholder={`Note ${i + 1} (opt.)`}
                onChangeText={(text) => handleInputChange(text, i)}
                value={value}
                />
                <Pressable onPress={() => removeInput(i)}>
                    <MinusCircle size={25} color={'black'}/>
                </Pressable>
            </View>
        )
    })

    const handleSaveActivity = () => {
        if(allFieldsFilled) {
            const bodyData = {
                tripId: selectedTrip,
                title, 
                plannedAt: date,
                token,
                note,
                address
            }
            const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/trips/addActivity`
            fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bodyData)
            })
            .then(response => response.json())
            .then(data => {
                //console.log('reponse addActivity', data)
                if(data.result) {
                    console.log(bodyData)
                    dispatch(initTrips(data.data))
                    navigation.navigate('TabNavigator')
                }
            })
        } else {
            if(title === '') {
                setShowAlertTitle(true)
            }
            else {
                setShowAlertTitle(false)
            }

            if(hour === 'Heure') {
                setShowAlertHour(true)
            }
            else {
                setShowAlertHour(false)
            }

            if(address === '') {
                setShowAlertAddress(true)
            }
            else {
                setShowAlertAddress(false)
            }
        }
    }

    return (
        <SafeAreaView style={{ alignItems: 'center', backgroundColor: '#EFEAD8', flex: 1 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 20 }}>
                Nouvelle Aventure
            </Text>
            <View style={{ marginTop: 20, borderWidth: 2, borderColor: '#D9CAB3', width: '85%', justifyContent: 'center', alignItems: 'center', height: 60, borderRadius: 10 }}>
                <Text style={{ fontSize: 18 }}>Jour {selectedDay}</Text>
            </View>
            <KeyboardAvoidingView
                style={{ width: '100%', alignItems: 'center' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView style={{ width: '80%', marginTop: 20 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput style={{ height: 50, borderColor: '#ccc', borderWidth: 2, backgroundColor: '#F7F6F2', width: '100%', borderRadius: 10, paddingLeft: 10, marginBottom: 20 }} placeholder='Nom de l’aventure *' onChangeText={(value) => setTitle(value)} value={title} />

                        
                        <Pressable onPress={showDatePicker} style={{ height: 50, borderColor: '#ccc', borderWidth: 2, backgroundColor: '#F7F6F2', width: '100%', borderRadius: 10, paddingLeft: 10, marginBottom: 20, justifyContent: 'center' }}>
                            {!hourSelected ? <Text style={{ color: '#8e8e8e' }}>Heure *</Text> : <Text>{hour}</Text>}
                        </Pressable>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="time"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />

                        
                        <TextInput style={{ height: 50, borderColor: '#ccc', borderWidth: 2, backgroundColor: '#F7F6F2', width: '100%', borderRadius: 10, paddingLeft: 10, marginBottom: 20 }} placeholder='Adresse *' onChangeText={(value) => setAddress(value)} value={address} />

                        
                        {note.map((value, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 }}>
                                <TextInput style={{ height: 40, borderColor: '#ccc', borderWidth: 2, backgroundColor: '#F7F6F2', borderRadius: 10, paddingLeft: 10, width: '85%', marginRight: 10 }} placeholder={`Note ${i + 1} (opt.)`} onChangeText={(text) => handleInputChange(text, i)} value={value} />
                                <Pressable onPress={() => removeInput(i)}>
                                    <MinusCircle size={25} color={'#5C4033'} />
                                </Pressable>
                            </View>
                        ))}
                        <Pressable onPress={addInput} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold', marginRight: 10 }}>Ajouter une note</Text>
                            <PlusCircle size={30} color={'#5C4033'} />
                        </Pressable>

                        
                        <View style={{ marginTop: 20, width: '80%' }}>
                            <Pressable onPress={handleSaveActivity} style={{ backgroundColor: '#A26734', alignItems: 'center', height: 50, justifyContent: 'center', borderRadius: 15 }}>
                                <Text style={{ fontSize: 18, color: 'white' }}>Sauvegarder l'Aventure</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}