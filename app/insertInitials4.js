import { useState } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import AppBackground from "../styles/AppBackground";

export default function InsertInitials4Screen() {
  const router = useRouter();
  const [initials, setInitials] = useState(["", "", "", ""]);
  const db = useSQLiteContext();

  const handleInputChange = (index, value) => {
    const formattedValue = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
    const newInitials = [...initials];
    newInitials[index] = formattedValue;
    setInitials(newInitials);
  };

  const handleConfirm = async () => {
    if (initials.some(init => init.length < 1 || init.length > 3)) {
      Alert.alert("Nav ievadīti visi spēlētāju iniciāļi.");
      return;
    }

  const unique = new Set(initials);
    if (unique.size < initials.length) {
      Alert.alert("Iniciāļi nedrīkst atkārtoties!");
      return;
    }

    try {
      const result = await db.runAsync(
        `INSERT INTO game (player_initials) VALUES (?);`,
        [JSON.stringify(initials)]
      );
      const gameId = result.lastInsertRowId;

      router.push({
        pathname: "/fourPlayers",
        params: { gameId, playerInitials: JSON.stringify(initials) },
      });
    } catch (error) {
      Alert.alert("Laža!", "Nevar saglabāt iniciāļus." + error.message);
      console.error("Error in handleConfirm:", error);
    }
  };

  return (
    <AppBackground>
           {/* ATPAKAĻ POGA */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/newGame")}
            >
              <Text style={styles.backButtonText}>Atpakaļ</Text>
            </TouchableOpacity>
      <Text style={styles.title}>Ievadi spēlētāju iniciāļus:</Text>

      {initials.map((initial, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={initial || ""}
          onChangeText={(text) => handleInputChange(index, text)}
          placeholder={`Spēlētājs ${index + 1}`}
          maxLength={3}
          autoCapitalize="characters"
        />
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleConfirm}
      >
        <Text style={styles.buttonText}>Sākt spēli</Text>
      </TouchableOpacity>
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
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 200,
    borderColor: "#0a0a0a",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#cfcd36",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#cfcd36",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
