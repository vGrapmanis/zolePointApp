import { Stack } from "expo-router/stack";
import { SQLiteProvider } from 'expo-sqlite';
import { createDbIfNeeded } from '../database/database';

export default function RootLayout() {
  return (  
    <SQLiteProvider databaseName="game.db" onInit={createDbIfNeeded}>  
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="newGame" />
        <Stack.Screen name="loadGame" />
        <Stack.Screen name="insertInitials3" />
        <Stack.Screen name="insertInitials4" />
        <Stack.Screen name="threePlayers" />
        <Stack.Screen name="fourPlayers" />
        <Stack.Screen name="finalResults" />
      </Stack>
    </SQLiteProvider>
  );
};
