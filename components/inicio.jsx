import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const Login = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logoCimpa.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Log in</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de usuario"
          placeholderTextColor="#888"
          value={nombreUsuario}
          onChangeText={setNombreUsuario}
          autoCapitalize="none"
          accessibilityLabel="Nombre de usuario"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={clave}
          onChangeText={setClave}
          secureTextEntry={!verClave}
          autoCapitalize="none"
          accessibilityLabel="Clave de acceso"
        />

        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  logoContainer: {
    marginBottom: 25,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default Login;
