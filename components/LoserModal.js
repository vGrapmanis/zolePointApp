import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";

export default function LoserModal({ visible, players, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Kurš zaudēja?</Text>
          <View style={styles.modalResultButtons}>
            {players.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={styles.modalResultButton}
                onPress={() => onSelect(i)}
              >
                <Text style={styles.modalButtonText}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}