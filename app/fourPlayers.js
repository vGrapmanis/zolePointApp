import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import gameLogic from "./gameLogic";
import styles from "./stylesFourPlayers";
import { BackHandler, Platform } from "react-native";


export default function FourPlayersScreen() {
  const db = useSQLiteContext();
  const { gameId, playerInitials } = useLocalSearchParams();
  const router = useRouter();
  const initialsArray = JSON.parse(playerInitials);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [showLoserModal, setShowLoserModal] = useState(false);
  const [confirmLoserModal, setConfirmLoserModal] = useState(false);
  const [confirmResultModal, setConfirmResultModal] = useState(false);
  const [pendingResult, setPendingResult] = useState(null);
  const [selectedLoserIndex, setSelectedLoserIndex] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [players, setPlayers] = useState(
    initialsArray.map((initial) => ({ name: initial, score: 0 }))
  );
  const [rounds, setRounds] = useState([]);
  const [lastFourRounds, setLastFourRounds] = useState([]);
  const [finalCycleActive, setFinalCycleActive] = useState(false);
  const [passedPlayers, setPassedPlayers] = useState([]);
  const [chooserIndex, setChooserIndex] = useState(0);
  const [confirmFinalCycleModal, setConfirmFinalCycleModal] = useState(false);
  const [finalCycleStartIndex, setFinalCycleStartIndex] = useState(null);
  const [finalCycleStartRound, setFinalCycleStartRound] = useState(null);
  const calculateRemainingRounds = (dealerIndex, totalPlayers = 4) => {
    return (totalPlayers - dealerIndex) % totalPlayers || totalPlayers;
  };
  const [remainingRounds, setRemainingRounds] = useState(null);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [finalCycleDealer, setFinalCycleDealer] = useState(null);

  useEffect(() => {
    if (db && gameId) {
      loadRounds();
    }
  }, [gameId]);

  const loadRounds = async () => {
    const result = await db.getAllAsync(`SELECT scores FROM rounds WHERE game_id = ?`, [gameId]);
    setRounds(result);
    setLastFourRounds(result.slice(-4).reverse());

    if (result.length > 0) {
      const latestScores = JSON.parse(result[result.length - 1].scores);
      setPlayers(players.map((p, i) => ({ ...p, score: latestScores[i] })));
      const nextDealer = result.length % players.length;
      setDealerIndex(nextDealer);
      setChooserIndex((nextDealer + 1) % players.length);
    } else {
      setDealerIndex(0);
      setChooserIndex(1);
    }
  };

  const saveRound = async (choice, result, updatedPlayers) => {
    await db.runAsync(
      `INSERT INTO rounds (game_id, choice, result, scores) VALUES (?, ?, ?, ?);`,
      [gameId, choice, result, JSON.stringify(updatedPlayers.map((p) => p.score))]
    );
    await loadRounds();

    if (finalCycleActive && dealerIndex === finalCycleDealer) {
      router.push({ pathname: "/finalResults", params: { gameId } });
    }
  };

  const getDealerIndex = () => rounds.length % players.length;

  const handleChoicePress = (choice) => {
    setSelectedChoice(choice);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setResultModalVisible(false);
  };

  const handleConfirmChoice = () => {
    setModalVisible(false);
    if (selectedChoice === "Garam") {
      const updatedPassed = [...passedPlayers, chooserIndex];
      setPassedPlayers(updatedPassed);
      if (updatedPassed.length === 3) setShowLoserModal(true);
      else setChooserIndex((chooserIndex + 1) % players.length);
    } else {
      setResultModalVisible(true);
    }
  };

  const handleConfirmResult = async (result) => {
    const updatedPlayers = [...players];
    const nextDealer = (dealerIndex + 1) % players.length
    gameLogic.calculateScores(updatedPlayers, selectedChoice, result, chooserIndex);
    await saveRound(selectedChoice, result, updatedPlayers);
    setPassedPlayers([]);
    setDealerIndex(nextDealer);
    setChooserIndex((nextDealer + 1) % players.length);
    setResultModalVisible(false);

    if (finalCycleActive && nextDealer === finalCycleDealer) {
      router.push({ pathname: "/finalResults", params: { gameId } });
    }
  };

  const handleLoserConfirmed = async () => {
    const updatedPlayers = [...players];
    const nextDealer = (dealerIndex + 1) % players.length;
    updatedPlayers.forEach((p, i) => (p.score += i === selectedLoserIndex ? -6 : 2));
    await saveRound("Garam", "Lose", updatedPlayers);
    setPassedPlayers([]);
    setDealerIndex(nextDealer);
    setChooserIndex((nextDealer + 1) % players.length);
    setConfirmLoserModal(false);

    if (finalCycleActive && nextDealer === finalCycleDealer) {
      router.push({ pathname: "/finalResults", params: { gameId } });
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
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* EXIT POGA */}
      <View style={{ marginTop: 20, gap: 10, width: "98%", alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#1976d2" }]}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Iziet uz sākumu</Text>
          </TouchableOpacity>
        </View>

          {finalCycleActive && <Text style={[styles.title, { color: "red" }]}>Pēdējais aplis</Text>}
            
                <View style={styles.row}>
                  {players.map((player, index) => (
                    <View key={index} style={styles.cell}>
                      <Text style={styles.playerName}>{player.name}</Text>
                    </View>
                  ))}
                </View>

      {lastFourRounds.map((round, index) => {
        const parsedScores = JSON.parse(round.scores);


        return (
          <View key={index} style={styles.row}>
            {parsedScores.map((score, idx) => (
              <View key={idx} style={styles.cell}>
                <Text style={styles.playerScore}>{score}</Text>
              </View>
            ))}
          </View>
          
        );
      })}

      {Array.from({ length: 4 - lastFourRounds.length }).map((_, idx) => (
        <View key={`empty-${idx}`} style={styles.row}>
          {players.map((_, i) => (
            <View key={i} style={styles.cell}>
              <Text style={styles.playerScore}>-</Text>
            </View>
          ))}
        </View>
      ))}

        <Text style={styles.title}>Dalītājs ir {players[getDealerIndex()]?.name}</Text> 
        <Text style={styles.title}>Izvēlas {players[chooserIndex]?.name}</Text>

      <View style={styles.buttonRow}>
        {"Lielais,Zole,Maza Zole,Garam".split(",").map((choice) => (
          <TouchableOpacity key={choice} style={styles.button} onPress={() => handleChoicePress(choice)}>
            <Text style={styles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!finalCycleActive && ( 
        <TouchableOpacity
          style={[styles.button, { width: "90%", backgroundColor: "#f57c00" }]}
          onPress={() => {
            setConfirmFinalCycleModal(true);
          }}
        >
          <Text style={styles.buttonText}>Pēdējais aplis</Text>
        </TouchableOpacity>
      )}

        

      {/* MODAL: Apstiprini izvēli (Lielais, Zole...) */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={handleModalClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Esi drošs?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmChoice}>
                <Text style={styles.modalButtonText}>Jā</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                <Text style={styles.modalButtonText}>Nē</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: Rezultāta izvēle */}
      <Modal visible={resultModalVisible} transparent animationType="fade" onRequestClose={handleModalClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalResultContent}>
            <Text style={styles.modalTitle}>Rezultāts:</Text>
            <View style={styles.modalResultButtons}>
              {resultOptions[selectedChoice]?.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalResultButton}
                  onPress={() => {
                    setPendingResult(result);
                    setResultModalVisible(false);
                    setConfirmResultModal(true);
                  }}
                >
                  <Text style={styles.modalButtonText}>{result}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.modalResultButton} onPress={handleModalClose}>
                <Text style={styles.modalButtonText}>Atpakaļ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: Apstiprini rezultātu */}
      <Modal visible={confirmResultModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Vai tiešām?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  handleConfirmResult(pendingResult);
                  setConfirmResultModal(false);
                  setPendingResult(null);
                }}
              >
                <Text style={styles.modalButtonText}>Jā</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setConfirmResultModal(false);
                  setResultModalVisible(true);
                  setPendingResult(null);
                }}
              >
                <Text style={styles.modalButtonText}>Nē</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: Galds zaudētāja izvēle */}
      <Modal visible={showLoserModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kurš zaudēja?</Text>
            <View style={styles.modalResultButtons}>
              {players.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.modalResultButton}
                  onPress={() => {
                    setSelectedLoserIndex(i);
                    setShowLoserModal(false);
                    setConfirmLoserModal(true);
                  }}
                >
                  <Text style={styles.modalButtonText}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: Galds apstiprinājums */}
      <Modal visible={confirmLoserModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Vai esi drošs, ka {players[selectedLoserIndex]?.name} zaudēja?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleLoserConfirmed}>
                <Text style={styles.modalButtonText}>Jā</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setConfirmLoserModal(false);
                  setShowLoserModal(true);
                }}
              >
                <Text style={styles.modalButtonText}>Nē</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
{/* PĒDĒJAIS APLIS */}
<Modal visible={confirmFinalCycleModal} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Vai tiešām sākt pēdējo apli?</Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => {
            setFinalCycleActive(true);
            setFinalCycleDealer((dealerIndex + players.length - 1) % players.length);
            setConfirmFinalCycleModal(false);
          }}
        >
          <Text style={styles.modalButtonText}>Jā</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setConfirmFinalCycleModal(false)}
        >
          <Text style={styles.modalButtonText}>Nē</Text>
        </TouchableOpacity>

      </View>
    </View>
  </View>
</Modal>

      

    </ScrollView>
  )};
