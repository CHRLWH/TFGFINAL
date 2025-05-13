import React from 'react';
import { Image, StyleSheet, View, Pressable, Text, Dimensions, ScrollView } from 'react-native';
import Navbar from '../../navbar/Navbar';
import MapView, { Marker } from 'react-native-maps';
import { Icon } from 'react-native-elements';

const ViewImage = ({ route, navigation }) => {
  const { image } = route.params;

  const testImage = `http://192.168.1.62:3000/imgs/${image.image}`;
  const latitude = parseFloat(image.latitud);
  const longitude = parseFloat(image.longitud);

  const isValidCoordinate = (val) => typeof val === 'number' && !isNaN(val);
  const showMap = isValidCoordinate(latitude) && isValidCoordinate(longitude);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://192.168.1.62:3000/delete/${image.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Imagen eliminada exitosamente');
        navigation.goBack();
      } else {
        console.log('Error al eliminar la imagen');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <Image
          source={{ uri: testImage }}
          style={styles.image}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{image.nombre}</Text>
          <Text style={styles.description}>{image.descripcion}</Text>
          <Text style={styles.date}>{image.fecha}</Text>
          <Text style={styles.points}>
            <Icon name='paid' /> {image.valor}
          </Text>
        </View>

        <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10 }}>
          {showMap ? 'Ubicación de la imagen' : 'Ubicación no disponible'}
        </Text>

        {showMap && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={image.nombre}
                description={image.descripcion}
              />
            </MapView>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.boton} onPress={handleDelete}>
            <Text style={styles.botonTexto}>Borrar Imagen</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Navbar />
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 300,
    height: 250,
    marginBottom: 20,
    borderRadius: 30,
    marginTop: '30%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 25,
    textAlign: 'center',
  },
  date: {
    fontSize: 20,
    marginTop: 5,
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  mapContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  actions: {
    alignItems: 'center',
  },
  boton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: 200,
    elevation: 4,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default ViewImage;
