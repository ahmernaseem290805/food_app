import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/Context/AuthContext";
import { CartProvider } from "./src/Context/CartContext";
import AppNav from "./src/navigation/AppNav";
import { colors } from "./src/design/theme";

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <AppNav />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
