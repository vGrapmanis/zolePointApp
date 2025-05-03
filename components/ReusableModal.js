import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";

export default function ReusableModal({ visible, title, buttons, onRequestClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={styles.modalButtons}>
            {buttons.map(({ text, onPress }, i) => (
              <TouchableOpacity key={i} style={styles.modalButton} onPress={onPress}>
                <Text style={styles.modalButtonText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}