import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

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
    router.push({
      pathname: "/fourPlayers",
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
    <View style={styles.container}>
      <Text style={styles.title}>Izvēlies spēli:</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
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
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CFD8DC",
    alignItems: "center",
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
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
