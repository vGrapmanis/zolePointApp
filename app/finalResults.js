import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";

export default function FinalResultsScreen() {
  const { gameId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState({});
  const gameTypes = ["Lielais", "Zole", "Maza Zole", "Galds"];

  useEffect(() => {
    if (db && gameId) {
      loadStats();
    }
  }, [gameId]);

  const loadStats = async () => {
    try {
      const game = await db.getFirstAsync("SELECT player_initials FROM game WHERE id = ?", [gameId]);
      const initials = JSON.parse(game.player_initials);
      setPlayers(initials);
      const rounds = await db.getAllAsync("SELECT choice, result, scores FROM rounds WHERE game_id = ?", [gameId]);
      const playerStats = {};
      initials.forEach((initial) => {
        playerStats[initial] = {
          "Lielais": { played: 0, wins: 0 },
          "Zole": { played: 0, wins: 0 },
          "Maza Zole": { played: 0, wins: 0 },
          "Galds": { losses: 0 },
        };
      });

      rounds.forEach((round, i) => {
        const { choice, result, scores } = round;
        const dealerIndex = i % initials.length;
        const chooserIndex = (dealerIndex + 1) % initials.length;
        const chooser = initials[chooserIndex];

        if (choice === "Garam" && result === "Lose") {
          const currentScores = JSON.parse(scores);
          const previousScores = i > 0 ? JSON.parse(rounds[i - 1].scores) : Array(initials.length).fill(0);
          const loserIndex = currentScores.findIndex((score, idx) => score - previousScores[idx] === -6);
            if (loserIndex !== -1) {
              const loserInitial = initials[loserIndex];
              playerStats[loserInitial]["Galds"].losses += 1;
            }
        } else if (playerStats[chooser]?.[choice]) {
          playerStats[chooser][choice].played += 1;
          if (!result.toLowerCase().includes("loss") && choice !== "Garam") {
            playerStats[chooser][choice].wins += 1;
          }
        }
      });

      setStats(playerStats);
      } catch (error) {
      console.error("Kļūda statistikā:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Spēles statistika</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Spēlētājs</Text>
            {gameTypes.map((type, index) => (
              <Text key={index} style={styles.headerCell}>{type === "Galds" ? "Galds\nzaudēts" : type}</Text>
            ))}
          </View>

          {players.map((player) => (
            <View key={player} style={styles.row}>
              <Text style={styles.cell}>{player}</Text>
              {gameTypes.map((type) => {
                const playerStat = stats[player]?.[type];
                let text = "-";
                if (type === "Galds" && playerStat) {
                  text = `${playerStat.losses}`;
                } else if (playerStat) {
                  text = `${playerStat.played}/${playerStat.wins}`;
                }
                return <Text key={type} style={styles.cell}>{text}</Text>;
              })}
            </View>
          ))}
        </View>

      <TouchableOpacity
        style={styles.exitButton}
        onPress={async () => {
          try {
            await db.runAsync("DELETE FROM rounds WHERE game_id = ?", [gameId]);
            await db.runAsync("DELETE FROM game WHERE id = ?", [gameId]);
          } catch (error) {
            console.error("Neizdevās dzēst spēli:", error);
          }
          router.replace("/");
        }}
      >
        <Text style={styles.buttonText}>Iziet un dzēst!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CFD8DC",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#cfcd36",
    borderWidth: 1,
    borderColor: "#000",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  exitButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    marginTop: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
