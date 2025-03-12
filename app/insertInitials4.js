import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { createTable, createNewGame } from './database';

export default function InsertInitials4Screen() {
    const router = useRouter();
    const [initials, setInitials] = useState(["", "", "", ""]);

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

        try {
            console.log('Creating tables...');
            createTable();
            console.log('Creating new game...');
            const gameId = await createNewGame(initials);
            console.log('Navigating to fourPlayers screen with gameId:', gameId);
            router.push({
                pathname: "/fourPlayers",
                params: { gameId }
            });
        } catch (error) {
            Alert.alert("Laža!", "Nevar saglabāt iniciāļus.");
            console.error('Error in handleConfirm:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ievadi spēlētāju iniciāļus:</Text>

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

            <TouchableOpacity
                style={styles.button}
                onPress={handleConfirm}
            >
                <Text style={styles.buttonText}>Sākt spēli</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#CFD8DC",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: 200,
        length: 60,
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