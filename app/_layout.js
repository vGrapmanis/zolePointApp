import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{ title: "Home Screen" }} />
    <Stack.Screen name="newGame" options={{ title: "Jauna Spēle" }} />
    <Stack.Screen name="loadGame" options={{ title: "Turpini Kapāt" }} />
    <Stack.Screen name="insertInitials3" options={{ title: "Insert Initials for 3 Players" }} />
    <Stack.Screen name="insertInitials4" options={{ title: "Insert Initials for 4 Players" }} />
    <Stack.Screen name="threePlayers" options={{ title: "3 Players Game" }} />
    <Stack.Screen name="fourPlayers" options={{ title: "4 Players Game" }} />
  </Stack>
);
}
