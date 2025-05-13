import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, Text, StyleSheet, View, Pressable, Dimensions, Animated } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Icono de FontAwesome
import { FadeIn } from 'react-native-reanimated';
import Navbar from '../navbar/Navbar';

const GaleriaPrueba = () => {
  const [images, setImages] = useState([]); // Estado para almacenar las imágenes
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const imageSize = (width - 60) / 2;

  // Petición fetch para obtener las imágenes e información
  useEffect(() => {
    fetch('http://192.168.1.62:3000/get', {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then((imageData) => {
        console.log('Datos recibidos:', imageData);
        // Almacenar los datos en el estado images
        setImages(imageData);
      })
      .catch((error) => console.error('Error al obtener datos:', error));
  }, []);

  // Filtrar los datos según el texto de búsqueda
  const filteredImages = images.filter(item => 
    item.image && item.image.toLowerCase().includes(search.toLowerCase()) // Asegurarse de que item.name esté definido
  );

  const renderImage = (item, index) => {
    const testImage = `http://192.168.1.62:3000/imgs/${item.image}`;
    return (
      <Pressable
        key={item.id}
        onPress={() => navigation.navigate('ViewImage', { image: item })} // Navegar a la pantalla de ViewImage con la imagen
      >
        <Animated.Image
          entering={FadeIn.delay(100 * index).duration(800)}
          source={{ uri: testImage }}
          style={[styles.image, { width: imageSize, height: imageSize }]}
          resizeMode="cover"
        />
      </Pressable>
    );
  };

  const scrollViewRef = React.createRef(); // Referencia al ScrollView

  // Función para hacer scroll al principio
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>GALERIA</Text>
      <SearchBar
        placeholder="Buscar..."
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchInput}
        inputStyle={{ fontSize: 16 }}
        searchIcon={<Icon name="search" size={24} color="#D32F2F" />}
        clearIcon={<Icon name="clear" size={24} color="#D32F2F" />}
        onClear={() => setSearch('')}
        onFocus={() => setSearch('')}
        onBlur={() => setSearch('')}
        round
        lightTheme
        showCancel={false}
        cancelIcon={<Icon name="cancel" size={24} color="#D32F2F" />}
        showLoading={false}
        showIcon={false}
        showCancelButton={false}/>     
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.gallery}
      >
        <Text style={styles.segundoTitulo}>Fotos</Text>
        <View style={styles.row}>
          {filteredImages.length > 0 ? (
            filteredImages.map((item, index) => renderImage(item, index)) // Mostrar imágenes filtradas
          ) : (
            <Text style={styles.noResults}>No se encontraron resultados</Text> // Mensaje si no hay resultados
          )}
        </View>
      </ScrollView>

      {/* Botón flotante para volver al inicio */}
      <Pressable style={styles.floatingButton} onPress={scrollToTop}>
        <FontAwesome name="arrow-up" size={24} color="white" />
      </Pressable>

      <View style={styles.footer}>
        <Navbar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  searchBar: {
    marginTop: '10%',
  },
  searchInput: {
    fontSize: 16,
  },
  gallery: {
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 100, // para dejar espacio al navbar fijo
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    borderRadius: 15,
    marginBottom: 10,
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  titulo: {
    fontSize: 40,
    flexDirection: 'row',
    marginTop: '25%',
    marginLeft: '10%',
    marginRight: '10%',
    width: '40%',
    fontWeight: 'bold',
    color: '#D32F2F',
    marginTop: '10%',
    boxShadow: '0px 9px rgb(255, 196, 0)',

  },
  segundoTitulo: {
    fontSize: 30,
    flexDirection: 'row',
    marginLeft: '10%',
    marginBottom: '5%',
    fontWeight: 'bold',
  },
  noResults: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 200, // Ajusta la posición vertical del botón flotante
    right: 25, // Ajusta la posición horizontal del botón flotante
    backgroundColor: '#D32F2F', // Color de fondo del botón
    borderRadius: 50, // Forma circular
    padding: 15, // Espaciado del ícono
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default GaleriaPrueba;
