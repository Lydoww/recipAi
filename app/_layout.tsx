import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="recipe-detail"
        options={{
          presentation: 'card',
          headerShown: true,
          title: '',
          headerStyle: {
            backgroundColor: '#FAFAF9',
          },
          headerTintColor: '#2F3E46',
        }}
      />
    </Stack>
  );
}
