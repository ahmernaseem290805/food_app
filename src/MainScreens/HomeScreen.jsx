import React, { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import EvilIcons from "@expo/vector-icons/EvilIcons";

import HeaderBar from "../components/HeaderBar";
import Categories from "../components/Categories";
import OfferSlider from "../components/OfferSlider";
import CardSlider from "../components/CardSlider";

import { colors } from "../design/theme";

import {
  loadSavedLocation,
  getCurrentLocationLabel,
  saveLocation,
} from "../utils/location";


export default function HomeScreen({ navigation }) {
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState(null);


  // =========================
  // Load User Location
  // =========================

  useEffect(() => {
    loadLocation();
  }, []);


  const loadLocation = async () => {
    try {
      // First check saved location
      const savedLocation =
        await loadSavedLocation();

      if (savedLocation) {
        setLocation(savedLocation);
        return;
      }

      // If no saved location,
      // fetch current location
      const currentLocation =
        await getCurrentLocationLabel();

      await saveLocation(
        currentLocation
      );

      setLocation(
        currentLocation
      );
    } catch (error) {
      console.log(
        "Location Error:",
        error.message
      );
    }
  };


  // =========================
  // Open Search
  // =========================

  const openSearch = () => {
    navigation.navigate("Search");
  };


  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      <View style={styles.root}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.content
          }
        >

          {/* =========================
              Header
          ========================= */}

          <HeaderBar
            location={location}
          />


          {/* =========================
              Search
          ========================= */}

          <TouchableOpacity
            style={styles.search}
            activeOpacity={0.8}
            onPress={openSearch}
          >
            <EvilIcons
              name="search"
              size={28}
              color={colors.primary}
            />

            <Text
              style={styles.placeholder}
            >
              Search food, drinks and more
            </Text>
          </TouchableOpacity>


          {/* =========================
              Categories
          ========================= */}

          <Categories
            navigation={navigation}
            onSelect={setCategory}
          />


          {/* =========================
              Today's Offers
          ========================= */}

          <OfferSlider
            navigation={navigation}
          />


          {/* =========================
              Popular Products
          ========================= */}

          <CardSlider
            navigation={navigation}
            category={category}
          />


          {/* Bottom spacing */}

          <View
            style={styles.bottomSpace}
          />

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}


// =========================
// Styles
// =========================

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },


  root: {
    flex: 1,
    backgroundColor: colors.background,
  },


  content: {
    paddingBottom: 20,
  },


  // =========================
  // Search
  // =========================

  search: {
    height: 48,

    width: "92%",

    alignSelf: "center",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 14,

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    marginVertical: 12,

    elevation: 3,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.1,

    shadowRadius: 4,
  },


  placeholder: {
    flex: 1,

    marginLeft: 8,

    color: "#999999",

    fontSize: 14,

    fontWeight: "500",
  },


  // =========================
  // Bottom Space
  // =========================

  bottomSpace: {
    height: 25,
  },

});