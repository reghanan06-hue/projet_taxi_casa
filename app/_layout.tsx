import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, //  cacher header
      }}
    >
       <Stack.Screen name="spalash" />
      <Stack.Screen name="map" />
      <Stack.Screen name="reservation" />
      <Stack.Screen name="course"
     
      />

    </Stack>
  );
}
