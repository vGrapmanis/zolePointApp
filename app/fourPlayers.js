import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import gameLogic from "./gameLogic";
import styles from "./stylesFourPlayers";

export default function FourPlayersScreen() {
  const db = useSQLiteContext();
  const { gameId, playerInitials } = useLocalSearchParams();
  const router = useRouter();

  let initialsArray = [];
  try {
    initialsArray = JSON.parse(playerInitials);
  } catch (error) {
    console.error("Neizdevās pārveidot playerInitials:", error);
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [selectedResult, setSelectedResult] = useState("");
  const [players, setPlayers] = useState(
    initialsArray.map((initial) => ({
      name: initial,
      score: 0,
    }))
  );
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (db && gameId) {
      displayScores(gameId);
    }
  }, [gameId]);

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

  const handleConfirmResult = async () => {
    const chosenPlayerIndex = 0;
    gameLogic.calculateScores(players, selectedChoice, selectedResult, chosenPlayerIndex);
    setResultModalVisible(false);

    try {
      await db.runAsync(
        `INSERT INTO rounds (game_id, choice, result, scores) VALUES (?, ?, ?, ?);`,
        [gameId, selectedChoice, selectedResult, JSON.stringify(players.map(p => p.score))]
      );
    } catch (error) {
      console.error("Nevar saglabāt raundu:", error);
    }
  };

  const displayScores = async (gameId) => {
    try {
      const result = await db.getAllAsync(
        `SELECT scores FROM rounds WHERE game_id = ?`,
        [gameId]
      );
      if (result.length > 0) {
        const lastScores = JSON.parse(result[result.length - 1].scores);
        const updatedPlayers = players.map((p, i) => ({
          ...p,
          score: lastScores[i] || 0,
        }));
        setPlayers(updatedPlayers);
      }
    } catch (error) {
      console.error("Nevar ielādēt rezultātus:", error);
    }
  };

  const resultOptions = {
    "Lielais": [
      "Win Basic", "Win Jani", "Win Bezstikis",
      "Loss Basic", "Loss Jani", "Loss Bezstikis"
    ],
    "Zole": [
      "Zole Win Basic", "Zole Win Jani", "Zole Win Bezstikis",
      "Zole Loss Basic", "Zole Loss Jani", "Zole Loss Bezstikis"
    ],
    "Maza Zole": ["Maza zole Win", "Maza zole Loss"],
    "Garam": ["Lose"],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spēlētāju Rezultāti:</Text>

      <View style={styles.row}>
        {players.map((player, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.row}>
        {players.map((player, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.playerScore}>{player.score}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        {["Lielais", "Zole", "Maza Zole", "Garam"].map((choice) => (
          <TouchableOpacity
            key={choice}
            style={styles.button}
            onPress={() => handleChoicePress(choice)}
          >
            <Text style={styles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal izvēlei */}
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

      {/* Modal rezultātam */}
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
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>Atpakaļ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
