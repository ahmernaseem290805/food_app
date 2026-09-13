import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import { colors, shadow } from "../design/theme";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Products"));

      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productsData);
    } catch (error) {
      console.log("Search products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const results = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) {
      return products;
    }

    return products.filter((product) => {
      const searchableFields = [
        product.name,
        product.Name,
        product.category,
        product.categoryId,
        product.description,
      ];

      return searchableFields.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchText)
      );
    });
  }, [products, query]);

  const renderProduct = ({ item }) => {
    const productName =
      item.Name || item.name || "Food Item";

    const category =
      item.category || item.categoryId || "Food";

    const price = Number(item.price || 0);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate("ProductScreen", {
            product: item,
          })
        }
      >
        <Image
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../Images/Biryani2.jpg")
          }
          style={styles.image}
        />

        <View style={styles.info}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {productName}
          </Text>

          <Text style={styles.category}>
            {category}
          </Text>

          <Text style={styles.price}>
            Rs. {price}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Search Food
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <EvilIcons
          name="search"
          size={30}
          color={colors.primary}
        />

        <TextInput
          autoFocus
          value={query}
          onChangeText={setQuery}
          placeholder="Search food, drinks and more"
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery("")}
            activeOpacity={0.7}
          >
            <EvilIcons
              name="close"
              size={25}
              color="#777"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />

          <Text style={styles.muted}>
            Loading menu...
          </Text>
        </View>
      ) : results.length === 0 ? (
        /* No Results */
        <View style={styles.center}>
          <Ionicons
            name="search-outline"
            size={60}
            color={colors.primary}
          />

          <Text style={styles.emptyTitle}>
            No food found
          </Text>

          <Text style={styles.muted}>
            Try another food or category.
          </Text>
        </View>
      ) : (
        /* Results */
        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  searchContainer: {
    height: 52,
    margin: 14,
    paddingHorizontal: 14,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    ...shadow,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    ...shadow,
  },

  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  info: {
    padding: 11,
  },

  name: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },

  category: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.primary,
    marginTop: 6,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "900",
    marginTop: 12,
    color: colors.text,
  },

  muted: {
    color: colors.muted,
    marginTop: 8,
    textAlign: "center",
  },
});