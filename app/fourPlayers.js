import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FourPlayersScreen() {
    const [playerInitials, setPlayerInitials] = useState([]);

    useEffect(() => {
        const fetchInitials = async () => {
            try{
                const storedInitials = await AsyncStorage.getItem("playerInitials");
                if(storedInitials){
                    setPlayerInitials(JSON.parse(storedInitials));
                }
            } catch (error) {
                console.error("Failed to load initials: ", error);
            }
        };

        fetchInitials();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Four Players Screen</Text>

            {playerInitials.length > 0 ? (
                <View style={styles.playerRow}>
                    {playerInitials.map((initial, index) => (
                        <View style={styles.initialBox}>
                            <Text key={index} style={styles.initials}>
                                {initial}
                            </Text>
                        </View>
                ))}
                </View>
            ) : (
                <Text style={styles.errorText}>No initials found.</Text>
            )}

            <View style={styles.table}>
                {Array(4).fill(null).map((_, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                        {Array(4).fill(null).map((_, colIndex) => (
                            <View key={colIndex} style={styles.tableCell}>
                                <Text style={styles.tableCellText}>{" "}</Text>
                            </View>                          
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    initials: {
        fontSize: 18,
        fontWeight: "bold",
    },

    initialBox: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },

    playerRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },

    errorText: {
        fontSize: 18,
        color: "red",
    },

    table: {
        width: "100%",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#ccc",
    },

    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    tableCell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    tableCellText: {
        fontSize: 18,
        color: "#ccc",
    },

});
