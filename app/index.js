import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Alert } from "react-native";
import AppBackground from "../styles/AppBackground"; 

export default function HomeScreen() {
  const router = useRouter();
  const db = useSQLiteContext();

  const handleNewGamePress = async () => {
    try {
      const result = await db.getAllAsync("SELECT COUNT(*) as count FROM game;");
      if (result[0].count >= 5) {
        Alert.alert(
          "Limits sasniegts!",
          "Maksimālais saglabāto spēļu skaits ir sasniegts. Lūdzu, izdzēs vai pabeidz kādu spēli."
        );
      } else {
        router.push("/newGame");
      }
    } catch (error) {
      console.error("Kļūda pārbaudot spēles:", error);
    }
  };
  
  return (
    <AppBackground>
      <StatusBar style="dark" backgroundColor="#CFD8DC" translucent={false}/>
      <Text style={styles.text}>Zoles punktu skaitīšanas asistents</Text>

      <TouchableOpacity
          style={styles.button}
          onPress={handleNewGamePress}
        >
          <Text style={styles.buttonText}>Jauna spēle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/loadGame")}
        >
          <Text style={styles.buttonText}>Turpini kapāt</Text>
        </TouchableOpacity>
    </AppBackground>

  );
}

const styles = StyleSheet.create({
  text: {
    fontSize:34,
    fontWeight: "bold",
    marginBottom: 15,
    margin: 10,
    textAlign: "center",
  },
  buttonText:{
    fontSize:22,
    fontWeight: "bold",
  },
  button:{
    backgroundColor: "#cfcd36",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});

