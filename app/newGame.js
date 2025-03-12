import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function NewGameScreen() {
    const router = useRouter();
    
    return (
    <View style={styles.container}>
      <Text style={styles.text}>Spēlētāju skaits:</Text>
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