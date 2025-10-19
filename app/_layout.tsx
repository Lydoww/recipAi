import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FAFAF9',
        },
        headerTintColor: '#2F3E46',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: true,
        headerBlurEffect: 'systemMaterial',
        headerTransparent: Platform.OS === 'ios',
      }}
    >
      <Stack.Screen
        name='index'
        options={{
          title: 'RecipAI',
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name='add-recipe'
        options={{
          title: 'Add Recipe',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='recipe-detail'
        options={{
          title: '',
          headerTransparent: false,
          headerTintColor: '#2F3E46',
        }}
      />
    </Stack>
  );
}
