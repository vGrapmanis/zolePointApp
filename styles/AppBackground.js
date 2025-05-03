import { ImageBackground, View, StyleSheet } from "react-native";

const backgroundImage = require("../assets/images/app_bckgrnd.png");

export default function AppBackground({ children }) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.85 }}
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(207, 216, 220, 0.3)", // pelēks caurspīdīgs overlays
    justifyContent: "center",
    alignItems: "center",
  },
});
