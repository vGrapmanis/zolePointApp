import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AppBackground from "../styles/AppBackground";

export default function NewGameScreen() {
    const router = useRouter();
    
  return (
      <AppBackground>

          {/* ATPAKAĻ POGA */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.backButtonText}>Atpakaļ uz sākumu</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Jauna spēle</Text>
        <Text style={styles.text}>Izvēlies spēlētāju skaitu:</Text>
          <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/insertInitials3")}
          >
                  <Text style={styles.buttonText}>3 Spēlētāji</Text>
          </TouchableOpacity>
        
          <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/insertInitials4")}
          >
              <Text style={styles.buttonText}>4 Spēlētāji</Text>
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
    text: {
      fontSize:34,
      fontWeight: "bold",
      marginBottom: 10,
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