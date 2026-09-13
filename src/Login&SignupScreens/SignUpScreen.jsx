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
import { EnvelopeIcon, LockClosedIcon } from 'react-native-heroicons/outline';
import CustomButton from '../components/CustomButton';
import { auth } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [loading, setLoading] = useState(false);

    const createAccountHandler = async () => {
        if (!email || !password || !cpassword) {
            Alert.alert('Please fill all the fields');
            return;
        }
        if (password !== cpassword) {
            Alert.alert('Passwords do not match');
            return;
        }
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email.trim(), password);
            // onAuthStateChanged will swap to AppStack
        } catch (error) {
            console.log('Sign up error:', error.code, error.message);
            let message = error.message;
            if (error.code === 'auth/email-already-in-use') {
                message = 'An account with this email already exists.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Password should be at least 6 characters.';
            }
            Alert.alert('Sign up failed', message);
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
                    <Text style={styles.LoginTxt}>Sign Up</Text>

                    <View style={styles.inputContainer}>
                        <EnvelopeIcon size={22} color="#FF3D00" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Email"
                            placeholderTextColor="#9A9A9A"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <LockClosedIcon size={22} color="#FF3D00" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Password"
                            placeholderTextColor="#9A9A9A"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <LockClosedIcon size={22} color="#FF3D00" />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Your Password"
                            placeholderTextColor="#9A9A9A"
                            secureTextEntry
                            value={cpassword}
                            onChangeText={setCpassword}
                        />
                    </View>

                    <View style={styles.buttonWrap}>
                        <CustomButton
                            title="Sign Up"
                            onPress={createAccountHandler}
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

export default SignUpScreen;

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
        fontSize: 38,
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
        color: '#FF3D00',
        textDecorationLine: 'underline',
        fontWeight: '700',
    },
});
