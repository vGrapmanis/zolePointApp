import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import AppBackground from "../styles/InGameAppBackground";

export default function FinalResultsScreen() {
  const { gameId } = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState({});
  const gameTypes = ["Lielais", "Zole", "Mazā Zole", "Galds"];
  const [lastRoundScores, setLastRoundScores] = useState(null);


  useEffect(() => {
    if (db && gameId) {
      loadStats();
    }
  }, [gameId]);

  const loadStats = async () => {
    try {
      const game = await db.getFirstAsync(
        "SELECT player_initials FROM game WHERE id = ?", 
        [gameId]
      );
      const initials = JSON.parse(game.player_initials);
      setPlayers(initials);
  
      const rounds = await db.getAllAsync(
        "SELECT choice, result, scores FROM rounds WHERE game_id = ?", 
        [gameId]
      );
  
      const playerStats = {};
      initials.forEach((initial) => {
        playerStats[initial] = {
          "Lielais": { played: 0, wins: 0 },
          "Zole": { played: 0, wins: 0 },
          "Mazā Zole": { played: 0, wins: 0 },
          "Galds": { losses: 0 },
        };
      });
  
      const normalizeChoice = (choice) => {
        const map = {
          "lielais": "Lielais",
          "zole": "Zole",
          "mazā zole": "Mazā Zole",
          "maza zole": "Mazā Zole"
        };
        return map[choice.toLowerCase().trim()] || choice.trim();
      };
  
      const winResults = [
        "Uzvara", "Uzvara Jaņi", "Uzvara Bezstiķis",
        "Zole Uzvara", "Zole Uzvara Jaņi", "Zole Uzvara Bezstiķis",
        "Mazā Zole Uzvara"
      ];
  
      if (rounds.length > 0) {
        const lastRound = rounds[rounds.length - 1];
        setLastRoundScores(JSON.parse(lastRound.scores)); 
      }
  
      rounds.forEach((round, i) => {
        const rawChoice = round.choice;
        const result = round.result;
        const choice = normalizeChoice(rawChoice);
  
        const dealerIndex = i % initials.length;
        const chooserIndex = (dealerIndex + 1) % initials.length;
        const chooser = initials[chooserIndex];
  
        // Galds gadījums
        if (rawChoice === "Garām" && result.startsWith("Galds:")) {
          const loserInitial = result.split(":")[1].trim();
          if (playerStats[loserInitial]) {
            playerStats[loserInitial]["Galds"].losses += 1;
          }
          return; // skip further
        }
  
        if (playerStats[chooser]?.[choice]) {
          playerStats[chooser][choice].played += 1;
          if (winResults.includes(result)) {
            playerStats[chooser][choice].wins += 1;
          }
        }
      });
  
      setStats(playerStats);
  
    } catch (error) {
      console.error("Kļūda statistikā:", error);
      Alert.alert(
        "Kļūda!",
        "Neizdevās ielādēt spēles statistiku.",
        [
          {
            text: "Uz sākumu",
            onPress: () => router.replace("/"),
          },
        ],
        { cancelable: false }
      );
    }
  };
  
  

  return (
    <AppBackground>
    <View style={styles.container}>
      
      {lastRoundScores && (
  <>
    <Text style={[styles.title, { marginBottom: 25 }]}>Gala rezultāts</Text>
   
    {/* Spēlētāju iniciāļi */}
    <View style={styles.row}>
      {players.map((player, index) => (
        <View key={index} style={styles.cell}>
          <Text style={styles.playerName}>{player}</Text> 
        </View>
      ))}
    </View>

    {/* Punkti */}
    <View style={styles.row}>
      {lastRoundScores.map((score, index) => (
        <View key={index} style={styles.cell}>
          <Text style={styles.latestPlayerScore}>{score}</Text>
        </View>
      ))}
    </View>
  </>
)}
<Text style={styles.title}>Spēles statistika</Text>
<Text style={styles.underTitle}>spēles/uzvaras</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>*</Text>
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
    </View>
    </AppBackground>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom:5,
    marginTop: 30,
  },
  underTitle:{
    fontSize: 20,
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
  latestPlayerScore: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  playerName: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
