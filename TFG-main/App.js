import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Index from './components/titleScreen/TitleScreen';  
import Home from './components/home/Home';
import Galeria from './components/gallery/Galeria';  
import ClassImage from './components/classes/ClassImage';
import Camera from './components/navbar/navbarCam/CameraComponent';
import ViewImage from './components/gallery/ViewImage/ViewImage';  
import { Animated, Easing } from 'react-native'; // ✅ CORRECTO para Expo


import 'react-native-gesture-handler';

const Stack = createStackNavigator();

// Definir animaciones personalizadas
const customTransition = {
  // Deslizar desde abajo
  slideFromBottom: {
    cardStyleInterpolator: ({ current, next, index }) => {
      const progress = Animated.add(current.progress, next ? next.progress : 0);

      // Aplicamos una animación con duración más lenta para un efecto suave
      return {
        cardStyle: {
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [100, 0, 0],
                extrapolate: 'clamp', // Prevenir los valores fuera del rango
              }),
            },
          ],
        },
      };
    },
  },

  // Zoom in (ampliación)
  zoomIn: {
    cardStyleInterpolator: ({ current, next, index }) => {
      const progress = Animated.add(current.progress, next ? next.progress : 0);

      // Aplicamos un zoom suave con una animación más lenta
      return {
        cardStyle: {
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0.9, 1, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      };
    },
  },

  // Fade in (desvanecimiento)
  fadeIn: {
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],// Configura la duración del desvanecimiento
          }),
        },
      };
    },
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Index">
        <Stack.Screen 
          name="Index" 
          component={Index}
          options={customTransition.fadeIn} // Fade para Index
        />
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={customTransition.zoomIn} // Zoom In para Home
        />
        <Stack.Screen 
          name="Galeria" 
          component={Galeria}
          options={customTransition.slideFromBottom} // Slide desde abajo para Galeria
        />
        <Stack.Screen 
          name="Home2" 
          component={Index}
          options={customTransition.slideFromBottom} // Slide desde abajo para Home2
        />
        <Stack.Screen 
          name="Camera" 
          component={Camera}
          options={customTransition.fadeIn} // Fade para Camera
        />
        <Stack.Screen 
          name="ViewImage" 
          component={ViewImage}
          options={customTransition.zoomIn} // Zoom In para ViewImage
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
