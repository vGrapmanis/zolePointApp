import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#CFD8DC" translucent={false}/>
      <Text style={styles.text}>Welcome to Zole Tracker</Text>

      <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/newGame")}
        >
          <Text style={styles.buttonText}>Jauna spēle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/loadGame")}
        >
          <Text style={styles.buttonText}>Turpini kapāt</Text>
        </TouchableOpacity>
      </View>

  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CFD8DC",
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize:28,
    fontWeight: "bold",
    marginBottom: 50,
  
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

