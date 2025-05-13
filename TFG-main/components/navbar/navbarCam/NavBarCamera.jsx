import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location";
import LoadingOverlay from "../../pantallaDeCarga/loadingScreen";
import AnimatedButton from '../../buttons/AnimatedButton';

const NavbarCamera = () => {
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      const locationPermission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted || !locationPermission.granted) {
        Alert.alert("Permiso requerido", "Se necesita acceso a la cámara y ubicación.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        base64: false,
        quality: 0.7,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri;

        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
        };

        await uploadImageToDB(photoUri, coords);
      }
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto.");
    }
  };

  const uploadImageToDB = async (uri, { latitud, longitud }) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("photo", {
        uri,
        name: uri.split("/").pop(),
        type: "image/jpeg",
      });

      formData.append("latitud", latitud.toString());
      formData.append("longitud", longitud.toString());

      const response = await fetch("http://192.168.1.62:3000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);

      setLoading(false);
      Alert.alert("¡Éxito!", "Imagen y ubicación subidas correctamente.");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setLoading(false);
      Alert.alert("Error", "Hubo un problema al subir la imagen.");
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <AnimatedButton onPress={takePhoto} style={styles.iconContainer}>
        <Icon name="add-circle" size={45} color="red" />
      </AnimatedButton>

      <LoadingOverlay visible={loading} message="Analizando Imagen..." />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: 'white',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavbarCamera;
