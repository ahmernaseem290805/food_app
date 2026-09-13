import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients } from "../design/theme";

const CustomButton = ({ onPress, title, disabled, loading, secondary = false }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.88}
    style={styles.wrap}
  >
    <LinearGradient
      colors={secondary ? gradients.secondary : gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.button, (disabled || loading) && styles.disabled]}
    >
      {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.text}>{title}</Text>}
    </LinearGradient>
  </TouchableOpacity>
);

export default CustomButton;

const styles = StyleSheet.create({
  wrap: { width: "100%" },
  button: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  disabled: { opacity: 0.55 },
  text: { color: "#FFF", fontSize: 17, fontWeight: "800" },
});
