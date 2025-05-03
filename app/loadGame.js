import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AppBackground from "../styles/AppBackground";

export default function LoadGameScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [games, setGames] = useState([]);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const result = await db.getAllAsync("SELECT id, player_initials FROM game ORDER BY id DESC;");
      setGames(result);
    } catch (error) {
      console.error("Nevar ielādēt spēles:", error);
    }
  };

  const handleGamePress = (gameId, playerInitials) => {
    const initials = JSON.parse(playerInitials);
    const screen = initials.length === 3 ? "/threePlayers" : "/fourPlayers";
  
    router.push({
      pathname: screen,
      params: { gameId, playerInitials }
    });
  };
  

  const handleDeleteGame = async (gameId) => {
    Alert.alert(
      "Apstiprināt dzēšanu",
      "Vai tiešām vēlies dzēst šo spēli?",
      [
        { text: "Atcelt", style: "cancel" },
        {
          text: "Dzēst",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync("DELETE FROM rounds WHERE game_id = ?", [gameId]);
              await db.runAsync("DELETE FROM game WHERE id = ?", [gameId]);
              loadGames();
            } catch (error) {
              console.error("Neizdevās dzēst spēli:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <AppBackground>
      <FlatList
  data={games}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  }}
  
  ListHeaderComponent={() => (
    <View style={{alignItems: "center"}}>
        {/* ATPAKAĻ POGA */}
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.backButtonText}>Atpakaļ uz sākumu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Izvēlies spēli:</Text>
    </View>
  )}

  renderItem={({ item }) => (
    <View style={styles.gameItem}>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => handleGamePress(item.id, item.player_initials)}
      >
        <Text style={styles.buttonText}>
          {JSON.parse(item.player_initials).join(", ")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGame(item.id)}
      >
        <Text style={styles.deleteText}>Dzēst</Text>
      </TouchableOpacity>
    </View>
  )}
  ListEmptyComponent={<Text>Nav saglabātu spēļu.</Text>}
/>

</AppBackground>
  );
}





const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0a0a0a",
    width: "98%",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
  
  },
  gameItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    width: "90%",
    justifyContent: "space-between",
  },
  playButton: {
    backgroundColor: "#cfcd36",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
