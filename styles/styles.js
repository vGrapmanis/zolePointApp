import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  baseButton: {
    padding: 15,
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0a0a0a",
    width: "90%",
  },
  exitButton: {
    backgroundColor: "#1976d2",
  },
  finalCycleButton: {
    backgroundColor: "#D32F2F"
  },
  finalExitButtonText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
 
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 10,
    alignItems: "center",
  },
  cell: {
    width: 60,
    alignItems: "center",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  playerScore: {
    fontSize: 18,
    marginTop: 5,
  },
  latestPlayerScore: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  initialBox: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0a0a0a",
    backgroundColor: "#2E7D32",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    width: "90%",
  },
  button: {
    backgroundColor: "#cfcd36",
    padding: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#0a0a0a",
    width: "45%",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#CFD8DC",
    padding: 20,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#0a0a0a",
    alignItems: "center",

  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    margin: 20,
    alignItems: "center",
    backgroundColor: "#cfcd36",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0a0a0a",
    width: 80,
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButtonText: {
    color: "#0a0a0a",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalResultContent: {
    width: "80%",
    backgroundColor: "#CFD8DC",
    padding: 20,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#0a0a0a",
    alignItems: "center",
  },
  modalResultButton: {
    padding: 10,
    margin: 10,
    backgroundColor: "#cfcd36",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0a0a0a",
  },
  modalResultButtons: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default styles;
