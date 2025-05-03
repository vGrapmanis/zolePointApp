import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";

export default function ResultModal({ visible, options, onSelect, onBack }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalResultContent}>
          <Text style={styles.modalTitle}>Rezultāts:</Text>
          <View style={styles.modalResultButtons}>
            {options.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalResultButton}
                onPress={() => onSelect(result)}
              >
                <Text style={styles.modalButtonText}>{result}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalResultButton} onPress={onBack}>
              <Text style={styles.modalButtonText}>Atpakaļ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}