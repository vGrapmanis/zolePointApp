import { Text, View, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Zole Tracker</Text>

      <View style={styles.buttonContainer}>
        <Button title="New Game" onPress={() => router.push("/newGame")} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Load Game" onPress={() => router.push("/loadGame")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20, 
  },
  buttonContainer: {
    width:200,
    marginVertical: 10,
  }
});