import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimatedButton from '../../buttons/AnimatedButton'; // Asegúrate de que la ruta sea correcta

const NavbarGallery = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.contenedor}>
      <AnimatedButton onPress={() => navigation.navigate('Galeria')}>
        <Icon name="image" size={45} color="#FFF" />
      </AnimatedButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default NavbarGallery;
