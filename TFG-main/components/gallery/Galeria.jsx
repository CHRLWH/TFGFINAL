import React, { useState, useEffect } from 'react';
import { ScrollView, SafeAreaView, Text, StyleSheet, View, Pressable, Dimensions, Animated } from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Icono de FontAwesome
import { FadeIn } from 'react-native-reanimated';
import Navbar from '../navbar/Navbar';

const GaleriaPrueba = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const { width } = Dimensions.get('window');
  const imageSize = (width - 60) / 2;

  // Método que obtiene las imágenes desde el servidor Flask
  useEffect(() => {
    const fetchImages = () => {
      fetch('http://192.168.1.62:3000/get', {
        method: 'GET',
      })
        .then((resp) => resp.json())
        .then((imageData) => {
          setImages(imageData);
        })
        .catch((error) => console.error('Error en obtención de datos', error));
    };

    fetchImages();

    // Se llama cada 10 segundos para hacer refresh
    const interval = setInterval(fetchImages, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filtro de búsqueda por nombre, fecha y ubicación
  const filteredImages = images.filter(item =>
    [item.nombre, item.fecha, item.ubicacion].some(field =>
      typeof field === 'string' && field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Render de cada imagen en la galería
  const renderImage = (item, index) => {
    const testImage = `http://192.168.1.62:3000/imgs/${item.image}`;
    return (
      <Pressable
        key={item.id}
        onPress={() => navigation.navigate('ViewImage', { image: item })}
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

  const scrollViewRef = React.createRef();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>GALERIA</Text>

      <SearchBar
        placeholder="Buscar por nombre..."
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.searchInput}
        inputStyle={styles.searchText}
        searchIcon={<Icon name="search" size={22} color="#000" />}
        clearIcon={<Icon name="close" size={22} color="#000" />}
        lightTheme
        round
      />

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.gallery}>
        <View style={styles.row}>
          {filteredImages.length > 0 ? (
            filteredImages.map((item, index) => renderImage(item, index))
          ) : (
            <Text style={styles.noResults}>No se encontraron resultados</Text>
          )}
        </View>
      </ScrollView>

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
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    marginHorizontal: 20,
    marginTop: 30,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 30,
    height: 45,
    paddingHorizontal: 10,
  },
  searchText: {
    fontSize: 16,
    color: '#000',
  },
  gallery: {
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  image: {
    borderRadius: 15,
    marginBottom: 10,
    boxShadow: '5px 5px rgb(255, 217, 0)', // ⚠️ Esto no es válido en React Native
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  titulo: {
    fontSize: 40,
    flexDirection: 'row',
    marginTop: '20%',
    marginLeft: '10%',
    marginRight: '10%',
    width: '40%',
    fontWeight: 'bold',
    color: '#D32F2F',
    boxShadow: '10px 10px rgb(255, 196, 0)', // ⚠️ No válido en React Native
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
    bottom: 200,
    right: 25,
    backgroundColor: '#D32F2F',
    borderRadius: 50,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default GaleriaPrueba;
