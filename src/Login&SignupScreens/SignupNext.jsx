import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from 'firebase/firestore';
import {
    UserIcon,
    PhoneIcon,
    MapPinIcon,
} from 'react-native-heroicons/outline';
import CustomButton from '../components/CustomButton';
import { db, auth } from '../../firebase/firebaseConfig';

const SignupNext = () => {
    const navigation = useNavigation();
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const submitProfile = async () => {
        if (!phone || !name) {
            Alert.alert('Please fill phone and name');
            return;
        }
        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Please sign up first');
            navigation.navigate('Signup');
            return;
        }
        try {
            setLoading(true);
            await setDoc(doc(db, 'UserProfiles', uid), {
                UserName: name,
                Phone: phone,
                Address: address,
                email: auth.currentUser?.email ?? '',
                createdAt: new Date().toISOString(),
            });
            Alert.alert('Profile saved');
        } catch (err) {
            console.log('Profile save error', err);
            Alert.alert('Could not save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.LoginTxt}>Complete Profile</Text>

                    <View style={styles.inputContainer}>
                        <PhoneIcon size={22} color="#FF6B35" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Phone Number"
                            placeholderTextColor="#9A9A9A"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <UserIcon size={22} color="#FF6B35" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Name"
                            placeholderTextColor="#9A9A9A"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MapPinIcon size={22} color="#FF6B35" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Address"
                            placeholderTextColor="#9A9A9A"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>

                    <View style={styles.buttonWrap}>
                        <CustomButton
                            title="Save Profile"
                            onPress={submitProfile}
                            loading={loading}
                        />
                    </View>

                    <View style={styles.loginDirect}>
                        <Text style={styles.loginPrompt}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignupNext;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#FFF8F3',
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    LoginTxt: {
        marginBottom: 32,
        fontSize: 34,
        fontWeight: '900',
        color: '#2D2D2D',
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        marginLeft: 10,
        color: '#2D2D2D',
        fontSize: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#FF6B35',
        borderRadius: 14,
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    buttonWrap: {
        width: '100%',
        marginTop: 8,
    },
    loginDirect: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 6,
    },
    loginPrompt: {
        fontSize: 15,
        color: '#7B7B7B',
    },
    loginLink: {
        fontSize: 15,
        color: '#FF6B35',
        textDecorationLine: 'underline',
        fontWeight: '700',
    },
});
