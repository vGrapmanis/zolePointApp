import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function InsertInitials3Screen(){
    const router = useRouter();
    const [initials, setInitials] = useState(["", "", ""]);

    const handleInputChange = (index, value) => {
        const formattedValue = value.toUpperCase().replace(/[^A-Z]/g, "").slice(0,3);
        const newInitials = [...initials];
        newInitials[index] = formattedValue;
        setInitials(newInitials);
    };

    const handleConfirm = () => {
        if(initials.some(init =>init.length < 1 || init.length > 3)){
            Alert.alert("Invalid Input", "Initials must be between 1 and 3 characters long.");
            return;
        }
        router.push("/threePlayers");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Insert player initials. Max 3 characters</Text>

            {initials.map((initial, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    value={initial}
                    onChangeText={(text) => handleInputChange(index, text)}
                    placeholder={`Player ${index + 1}`}
                    maxLength={3}
                    autoCapitalize="characters"
                />
            ))}

            <Button title="Confirm" onPress={handleConfirm} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize:24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: 200,
        length: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        textAlign: "center",
        fontSize: 18,
    },
});

