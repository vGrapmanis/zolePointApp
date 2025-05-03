import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { useSQLiteContext } from "expo-sqlite";

import gameLogic3 from "./gameLogic3";
import styles from "../styles/styles";
import AppBackground from "../styles/InGameAppBackground";
import ReusableModal from "../components/ReusableModal";
import ResultModal from "../components/ResultModal";
import ConfirmModal from "../components/ConfirmModal";
import LoserModal from "../components/LoserModal";

export default function ThreePlayersScreen() {
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
  const [lastThreeRounds, setLastThreeRounds] = useState([]);
  const [finalCycleActive, setFinalCycleActive] = useState(false);
  const [passedPlayers, setPassedPlayers] = useState([]);
  const [chooserIndex, setChooserIndex] = useState(0);
  const [confirmFinalCycleModal, setConfirmFinalCycleModal] = useState(false);
  const [dealerIndex, setDealerIndex] = useState(0);
 
  useEffect(() => {
    if (db && gameId) {
      loadRounds();
    }
  }, [gameId]);

  const loadRounds = async () => {
    try {
      const result = await db.getAllAsync("SELECT scores FROM rounds WHERE game_id = ?", [gameId]);
      setRounds(result);
      setLastThreeRounds(result.slice(-3).reverse());
  
      if (result.length > 0) {
        const latestScores = JSON.parse(result[result.length - 1].scores);
        const updatedPlayers = initialsArray.map((name, i) => ({
          name,
          score: latestScores[i]
        }));
        setPlayers(updatedPlayers);
      
        const nextDealer = result.length % players.length;
        setDealerIndex(nextDealer);
        setChooserIndex((nextDealer + 1) % players.length);
      } else {
        setDealerIndex(0);
        setChooserIndex(1);
      }
    } catch (error) {
      console.error("Kļūda ielādējot raundus:", error);
    }
  };
  
  const saveRound = async (choice, result, updatedPlayers) => {
    await db.runAsync(
      `INSERT INTO rounds (game_id, choice, result, scores) VALUES (?, ?, ?, ?);`,
      [gameId, choice, result, JSON.stringify(updatedPlayers.map((p) => p.score))]
    );
    await loadRounds();

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
    if (selectedChoice === "Garām") {
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
    gameLogic3.calculateScores(updatedPlayers, selectedChoice, result, chooserIndex);
    await saveRound(selectedChoice, result, updatedPlayers);
    setPassedPlayers([]);
    setDealerIndex(nextDealer);
    checkFinalCycleEnd(); 
    setChooserIndex((nextDealer + 1) % players.length);
    setResultModalVisible(false);
  };

  const handleLoserConfirmed = async () => {
    const updatedPlayers = [...players];
    const nextDealer = (dealerIndex + 1) % players.length;
    updatedPlayers.forEach((p, i) => (p.score += i === selectedLoserIndex ? -4 : 2));
    setConfirmLoserModal(false);
    const loserName = players[selectedLoserIndex]?.name;
    await saveRound("Garām", `Galds: ${loserName}`, updatedPlayers);
    setPassedPlayers([]);
    setDealerIndex(nextDealer);
    checkFinalCycleEnd(); 
    setChooserIndex((nextDealer + 1) % players.length);
    setResultModalVisible(false);
  };

  const resultOptions = {
    "Lielais": [
      "Uzvara", "Uzvara Jaņi", "Uzvara Bezstiķis",
      "Zaudējums", "Zaudējums Jaņi", "Zaudējums Bezstiķis"
    ],
    "Zole": [
      "Zole Uzvara", "Zole Uzvara Jaņi", "Zole Uzvara Bezstiķis",
      "Zole Zaudējums", "Zole Zaudējums Jaņi", "Zole Zaudējums Bezstiķis"
    ],
    "Mazā Zole": ["Mazā Zole Uzvara", "Mazā Zole Zaudējums"],
  };

  const checkFinalCycleEnd = () => {
    if (finalCycleActive && dealerIndex === players.length - 1) {
      router.push({ pathname: "/finalResults", params: { gameId } });
    }
  };
  
  
  
  return (
    <AppBackground>
      <View style={styles.container}>

        {/* Pēdējais aplis poga */}
        {!finalCycleActive && ( 
          <TouchableOpacity
            style={[styles.baseButton, styles.finalCycleButton]}
            onPress={() => setConfirmFinalCycleModal(true)}
          >
            <Text style={styles.finalExitButtonText}>Pēdējais aplis</Text>
          </TouchableOpacity>
        )}

        {/* EXIT POGA */}
          <TouchableOpacity
            style={[styles.baseButton, styles.exitButton]}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.finalExitButtonText}>Iziet uz sākumu</Text>
          </TouchableOpacity>
          
          {/* Pēdējais aplis aktivizēts */}
          {finalCycleActive && <Text style={[styles.title, { color: "red" }]}>Pēdējais aplis</Text>}
            
          <View style={styles.row}>
            {players.map((player, index) => (
              <View key={index} style={styles.cell}>
                <Text style={styles.playerName}>{player.name}</Text>
              </View>
            ))}
          </View>

          {lastThreeRounds.map((round, index) => {
            const parsedScores = JSON.parse(round.scores);
              return (
                <View key={index} style={styles.row}>
                  {parsedScores.map((score, idx) => (
                    <View key={idx} style={styles.cell}>
                      <Text style={index === 0 ? styles.latestPlayerScore : styles.playerScore}>{score}</Text>
                    </View>
                  ))}
                </View> 
              );
            })}

      {Array.from({ length: 3 - lastThreeRounds.length }).map((_, idx) => (
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
        {"Lielais,Zole,Mazā Zole,Garām".split(",").map((choice) => (
          <TouchableOpacity key={choice} style={styles.button} onPress={() => handleChoicePress(choice)}>
            <Text style={styles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}
      </View>

        {/* MODAL: Apstiprini izvēli (Lielais, Zole, Mazā Zole, Garām) */}
        <ReusableModal
          visible={modalVisible}
          title="Esi drošs?"
          onRequestClose={handleModalClose}
          buttons={[
            { text: "Jā", onPress: handleConfirmChoice },
            { text: "Nē", onPress: handleModalClose },
          ]}
        />

        {/* MODAL: Rezultāta izvēle */}
        <ResultModal
          visible={resultModalVisible}
          options={resultOptions[selectedChoice] || []}
          onSelect={(result) => {
            setPendingResult(result);
            setResultModalVisible(false);
            setConfirmResultModal(true);
          }}
          onBack={handleModalClose}
        />

        {/* MODAL: Apstiprini rezultātu */}
        <ConfirmModal
          visible={confirmResultModal}
          message="Vai tiešām?"
          onConfirm={() => {
            handleConfirmResult(pendingResult);
            setConfirmResultModal(false);
            setPendingResult(null);
          }}
          onCancel={() => {
            setConfirmResultModal(false);
            setResultModalVisible(true);
            setPendingResult(null);
          }}
        />


        {/* MODAL: Galds zaudētāja izvēle */}
        <LoserModal
          visible={showLoserModal}
          players={players}
          onSelect={(i) => {
            setSelectedLoserIndex(i);
            setShowLoserModal(false);
            setConfirmLoserModal(true);
          }}
        />

        {/* MODAL: Galds apstiprinājums */}
        <ConfirmModal
          visible={confirmLoserModal}
          message={`Vai esi drošs, ka ${players[selectedLoserIndex]?.name || "spēlētājs"} zaudēja?`}
          onConfirm={handleLoserConfirmed}
          onCancel={() => {
            setConfirmLoserModal(false);
            setShowLoserModal(true);
          }}
        />

        {/* PĒDĒJAIS APLIS */}
        <ConfirmModal
          visible={confirmFinalCycleModal}
          message="Vai tiešām sākt pēdējo apli?"
          onConfirm={() => {
            setFinalCycleActive(true);
            setConfirmFinalCycleModal(false);
          }}
          onCancel={() => setConfirmFinalCycleModal(false)}
        />

      </View>
    </AppBackground>
  )};
