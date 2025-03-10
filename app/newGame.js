import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

export default function NewGameScreen() {
    const router = useRouter();
    
    return (
    <View style={styles.container}>
      <Text style={styles.text}>Choose player count</Text>

      <View style={styles.buttonContainer}>
        <Button title="3 Players" onPress={() => router.push("/insertInitials3")} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="4 Players" onPress={() => router.push("/insertInitials4")} />
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
    text: {
        fontSize: 24,
        fontWeight: "bold",
    },
});