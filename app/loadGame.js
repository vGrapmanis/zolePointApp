import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Izvēlies spēli:</Text>
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleGamePress(item.id, item.player_initials)}
          >
            <Text style={styles.buttonText}>Spēle #{item.id} - {JSON.parse(item.player_initials).join(", ")}</Text>
          </TouchableOpacity>
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
  button: {
    backgroundColor: "#cfcd36",
    padding: 12,
    marginVertical: 6,
    borderRadius: 5,
    borderWidth: 1,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
