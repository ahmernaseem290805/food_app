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
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EnvelopeIcon, LockClosedIcon } from 'react-native-heroicons/outline';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import { auth } from '../../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../Context/AuthContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { remember, setRemember } = useContext(AuthContext);

    const LoginHandler = async () => {
        if (!email || !password) {
            Alert.alert('Please enter email and password');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            // onAuthStateChanged in AuthContext + AppNav will switch to AppStack automatically.
        } catch (error) {
            console.log('Login failed:', error.code, error.message);
            let message = error.message;
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                message = 'Invalid email or password.';
            } else if (error.code === 'auth/user-not-found') {
                message = 'No account exists with this email.';
            }
            Alert.alert('Login failed', message);
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
                    <Text style={styles.LoginTxt}>Login</Text>

                    <View style={styles.inputContainer}>
                        <EnvelopeIcon size={22} color="#FF3D00" />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Email"
                            placeholderTextColor="#9A9A9A"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
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

                    <TouchableOpacity
                        style={styles.rememberRow}
                        onPress={() => setRemember(!remember)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons
                            name={remember ? 'check-box' : 'check-box-outline-blank'}
                            size={22}
                            color="#FF3D00"
                        />
                        <Text style={styles.rememberText}>Remember me</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonWrap}>
                        <CustomButton
                            title="Login"
                            onPress={LoginHandler}
                            disabled={loading}
                            loading={loading}
                        />
                    </View>

                    <View style={styles.signUp}>
                        <Text style={styles.signUpPrompt}>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Next')}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;

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
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginVertical: 12,
    },
    rememberText: {
        marginLeft: 8,
        fontSize: 15,
        color: '#2D2D2D',
    },
    buttonWrap: {
        width: '100%',
        marginTop: 8,
    },
    signUp: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 6,
    },
    signUpPrompt: {
        fontSize: 15,
        color: '#7B7B7B',
    },
    signUpLink: {
        fontSize: 15,
        color: '#FF3D00',
        textDecorationLine: 'underline',
        fontWeight: '700',
    },
});
