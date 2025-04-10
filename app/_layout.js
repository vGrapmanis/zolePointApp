import { Stack } from "expo-router/stack";
import { SQLiteProvider } from 'expo-sqlite';

export default function RootLayout() {
  return (  
    <SQLiteProvider databaseName="game.db" onInit={createDbIfNeeded}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home Screen" }} />
        <Stack.Screen name="newGame" options={{ title: "Jauna Spēle" }} />
        <Stack.Screen name="loadGame" options={{ title: "Turpini Kapāt" }} />
        <Stack.Screen name="insertInitials3" options={{ title: "Insert Initials for 3 Players" }} />
        <Stack.Screen name="insertInitials4" options={{ title: "Insert Initials for 4 Players" }} />
        <Stack.Screen name="threePlayers" options={{ title: "3 Players Game" }} />
        <Stack.Screen name="fourPlayers" options={{ title: "4 Players Game" }} />
      </Stack>
    </SQLiteProvider>
  );
}

const createDbIfNeeded = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS game (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_initials TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS rounds (
      game_id INTEGER,
      choice TEXT,
      result TEXT,
      scores TEXT,
      FOREIGN KEY(game_id) REFERENCES game(id)
    );
  `);
};
