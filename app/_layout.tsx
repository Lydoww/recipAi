import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#10b981',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen name='index' options={{ title: '🍳 RecipAI' }} />
      <Stack.Screen name='add-recipe' options={{ title: 'Add Recipe' }} />
      <Stack.Screen name='recipe-detail' options={{ title: 'Recipe' }} />
    </Stack>
  );
}
