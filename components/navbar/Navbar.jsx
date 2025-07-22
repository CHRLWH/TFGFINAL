import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NavbarHome from './navbarHome/NavbarHome';
import NavbarCamera from './navbarCam/NavBarCamera';
import NavbarGallery from './navbarGallery/NavbarGallery';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigation = useNavigation();

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <View style={styles.contenedorNavegacion}>
          <NavbarHome
            isActive={activeTab === 'home'}
            onPress={() => {
              setActiveTab('home');
              navigation.navigate('Home');
            }}
          />
          <NavbarCamera
            isActive={activeTab === 'camera'}
            onPress={() => setActiveTab('camera')}
          />
          <NavbarGallery
            isActive={activeTab === 'gallery'}
            onPress={() => {
              setActiveTab('gallery');
              navigation.navigate('Galeria');
            }}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  contenedorNavegacion: {
    alignSelf: 'center',
    width: '90%',
    height: 100,
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 50,
    marginHorizontal: '4%',
    shadowColor: '#000',
    boxShadow: '0px 10px rgb(243, 175, 175)',
  },
  container: {
    marginHorizontal: '3%',
    marginBottom: '17%',
  },
});

export default Navbar;
