import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, } from "react-native";
import gameLogic from "./gameLogic";
import styles from "./stylesFourPlayers";
import { copyDatabaseFile } from './database';
import { useRouter } from "expo-router";


export default function FourPlayersScreen() {
    const [playerInitials, setPlayerInitials] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState("");
    const [selectedResult, setSelectedResult] = useState("");
    const [players, setPlayers] = useState([]);
    const router = useRouter();
   

    useEffect(() => {
        const fetchInitials = async () => {
            try{
                const players = await fetchInitials();
                setPlayerInitials(initials);
                const playerdata = initials.map((initial, index) => ({
                    name: `Player ${index + 1} (${initial})`,
                    score: 0,
                }));
                setPlayers(playerdata);
            } catch (error) {
                console.error("Failed to load initials: ", error);
            }
        };
        loadInitials();
    }, []);

    const handleChoicePress = (choice) => {
        setSelectedChoice(choice);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleResultModalClose = () => {
        setResultModalVisible(false);
    };

    const handleConfirmChoice = () => {
        setModalVisible(false);
        setResultModalVisible(true);
    };

    const handleConfirmResult = () => {
        const chosenPlayerIndex = 0; // Example index, you can change this based on your logic
        gameLogic.calculateScores(players, selectedChoice, selectedResult, chosenPlayerIndex);
        setResultModalVisible(false);
    };

    const resultOptions = {
        "Lielais": ["Win Basic", "Win Jani", "Win Bezstikis", "Loss Basic", "Loss Jani", "Loss Bezstikis"],
        "Zole": ["Zole Win Basic", "Zole Win Jani", "Zole Win Bezstikis", "Zole Loss Basic", "Zole Loss Jani", "Zole Loss Bezstikis"],
        "Maza Zole": ["Maza zole Win", "Maza zole Loss"],
        "Garam": ["Lose"],
    };

    return (
        <View style={styles.container}>
{/* PLAYER INITIALS */}
            {playerInitials.length > 0 ? (
                <View style={styles.playerRow}>
                    {playerInitials.map((initial, index) => (
                        <View style={styles.initialBox} key={index}>
                            <Text style={styles.initials}>
                                {initial}
                            </Text>
                        </View>
                ))}
                </View>
            ) : (
                <Text style={styles.errorText}>Iniciāļi nav atrasti.</Text>
            )}
{/* SCOREBOARD */}
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
{/* MAIN CHOICE BUTTONS */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleChoicePress("Lielais")}
                >
                    <Text style={styles.buttonText}>Lielais</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleChoicePress("Zole")}
                >
                    <Text style={styles.buttonText}>Zole</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleChoicePress("Maza Zole")}
                >
                    <Text style={styles.buttonText}>Maza Zole</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleChoicePress("Garam")}
                >
                    <Text style={styles.buttonText}>Garam</Text>
                </TouchableOpacity>
            </View>
{/*MAIN MODALS, POP-UP CHOICES */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Esi drošs?</Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleConfirmChoice}
                                >
                                    <Text style={styles.modalButtonText}>Jā</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleModalClose}
                                >
                                    <Text style={styles.modalButtonText}>Nē</Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                </View>
            </Modal>
{/* RESULT MODAL */}
            <Modal
                visible={resultModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={handleResultModalClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalResultContent}>
                        <Text style={styles.modalTitle}>Rezultāts:</Text>
                        <View style={styles.modalResultButtons}>
                            {resultOptions[selectedChoice] ? (
                                resultOptions[selectedChoice].map((result, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.modalResultButton}
                                    onPress={() => {
                                        setSelectedResult(result); 
                                        handleConfirmResult();
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>{result}</Text>
                                </TouchableOpacity>
                            ))
                            ) : (
                                <Text style={styles.errorText}>Rezultāts nav atrasts.</Text>
                            )}
                            <TouchableOpacity
                                style={styles.modalResultButton}
                                onPress={() => {
                                    setResultModalVisible(false);
                                    handleModalClose();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Atpakaļ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal> 
            <TouchableOpacity
                            style={styles.button}
                            onPress={copyDatabaseFile}
                        >
                            <Text style={styles.buttonText}>Copy Database</Text>
                        </TouchableOpacity>
        </View>
    );
}


