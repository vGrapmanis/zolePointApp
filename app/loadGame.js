import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoadGameScreen(){

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Load Game</Text>
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