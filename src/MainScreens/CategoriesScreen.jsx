import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import { LinearGradient } from "expo-linear-gradient";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";

import {
  colors,
  gradients,
} from "../design/theme";


export default function CategoriesScreen({
  navigation,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);


  // =========================
  // Load Categories
  // =========================

  useEffect(() => {
    loadCategories();
  }, []);


  const loadCategories = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "Categories")
      );

      const categoriesData =
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

      setCategories(categoriesData);
    } catch (error) {
      console.log(
        "Categories Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // Category Card
  // =========================

  const renderCategory = ({ item }) => {
    const categoryName =
      item.name || item.id;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate(
            "AllProducts",
            {
              category: categoryName,
            }
          )
        }
      >
        <LinearGradient
          colors={gradients.primary}
          style={styles.gradient}
          start={{
            x: 0,
            y: 0,
          }}
          end={{
            x: 1,
            y: 1,
          }}
        >
          <Ionicons
            name="restaurant-outline"
            size={38}
            color="#FFFFFF"
          />

          <Text style={styles.name}>
            {categoryName}
          </Text>

          <Text style={styles.explore}>
            Explore products →
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };


  // =========================
  // Loading Screen
  // =========================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={["top"]}
      >
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.loadingText}>
            Loading categories...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  // =========================
  // Main Screen
  // =========================

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      {/* Header */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.8}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>


        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Explore Categories
          </Text>

          <Text style={styles.sub}>
            Find something delicious
          </Text>
        </View>

      </View>


      {/* Categories */}

      <FlatList
        data={categories}
        numColumns={2}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={renderCategory}

        columnWrapperStyle={
          styles.row
        }

        contentContainerStyle={
          styles.list
        }

        showsVerticalScrollIndicator={
          false
        }
      />
    </SafeAreaView>
  );
}


// =========================
// Styles
// =========================

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },


  // Header

  header: {
    backgroundColor:
      colors.primary,

    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,

    flexDirection: "row",
    alignItems: "center",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },


  back: {
    width: 40,
    height: 40,

    borderRadius: 14,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },


  headerContent: {
    flex: 1,
  },


  title: {
    fontSize: 21,
    fontWeight: "900",
    color: "#FFFFFF",
  },


  sub: {
    color:
      "rgba(255,255,255,0.8)",

    marginTop: 3,
    fontSize: 13,
  },


  // List

  list: {
    padding: 16,
    paddingBottom: 100,
  },


  row: {
    justifyContent:
      "space-between",
  },


  // Category Card

  card: {
    width: "48%",
    height: 170,

    borderRadius: 20,

    overflow: "hidden",

    marginBottom: 16,

    elevation: 4,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },


  gradient: {
    flex: 1,

    padding: 18,

    justifyContent:
      "flex-end",
  },


  name: {
    color: "#FFFFFF",

    fontSize: 21,

    fontWeight: "900",

    marginTop: 10,
  },


  explore: {
    color:
      "rgba(255,255,255,0.85)",

    fontSize: 12,

    marginTop: 4,

    fontWeight: "600",
  },


  // Loading

  center: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor:
      colors.background,
  },


  loadingText: {
    marginTop: 10,

    color: colors.muted,

    fontSize: 14,
  },

});