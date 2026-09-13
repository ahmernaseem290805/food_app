import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";

import {
  colors,
  shadow,
} from "../design/theme";


export default function AllProductsScreen({
  navigation,
  route,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const category =
    route?.params?.category || "All";


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);


  const loadProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      console.log("================================");
      console.log("Loading Products...");
      console.log("Firestore DB:", db);
      console.log("================================");


      const productsRef = collection(
        db,
        "Products"
      );


      const snapshot = await getDocs(
        productsRef
      );


      console.log(
        "Products documents:",
        snapshot.size
      );


      const productsData = snapshot.docs.map(
        (productDoc) => ({
          id: productDoc.id,
          ...productDoc.data(),
        })
      );


      console.log(
        "Products data:",
        productsData
      );


      setProducts(productsData);


    } catch (error) {

      console.log(
        "================================"
      );

      console.log(
        "PRODUCT LOAD ERROR"
      );

      console.log(
        "Code:",
        error?.code
      );

      console.log(
        "Message:",
        error?.message
      );

      console.log(
        "Full Error:",
        error
      );

      console.log(
        "================================"
      );


      if (
        error?.code ===
        "permission-denied"
      ) {
        setErrorMessage(
          "Firebase permission denied. Please check Firestore Rules."
        );
      }

      else if (
        error?.code ===
        "failed-precondition"
      ) {
        setErrorMessage(
          "Firebase configuration or Firestore setup problem."
        );
      }

      else if (
        error?.code ===
        "unavailable"
      ) {
        setErrorMessage(
          "Could not connect to Firebase. Check your internet connection."
        );
      }

      else {
        setErrorMessage(
          error?.message ||
          "Could not load products."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // FILTER PRODUCTS BY CATEGORY
  // ==========================================

  const visibleProducts = useMemo(() => {

    if (category === "All") {
      return products;
    }


    return products.filter(
      (product) => {

        const productCategory =
          String(
            product.category ||
            product.categoryId ||
            ""
          )
            .trim()
            .toLowerCase();


        const selectedCategory =
          String(category)
            .trim()
            .toLowerCase();


        return (
          productCategory ===
          selectedCategory
        );
      }
    );

  }, [products, category]);


  // ==========================================
  // PRODUCT CARD
  // ==========================================

  const renderProduct = ({
    item,
  }) => {

    const productName =
      item.Name ||
      item.name ||
      "Food Item";


    const productCategory =
      item.category ||
      item.categoryId ||
      "Food";


    const productPrice =
      Number(item.price || 0);


    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.88}
        onPress={() =>
          navigation.navigate(
            "ProductScreen",
            {
              product: item,
            }
          )
        }
      >

        <Image
          source={
            item.imageUrl
              ? {
                  uri: item.imageUrl,
                }
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


          <Text style={styles.cat}>
            {productCategory}
          </Text>


          <Text style={styles.price}>
            Rs. {productPrice}
          </Text>


          {item.available === false && (
            <Text style={styles.out}>
              Out of stock
            </Text>
          )}

        </View>

      </TouchableOpacity>
    );
  };


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (
    !loading &&
    errorMessage
  ) {

    return (
      <SafeAreaView
        style={styles.safe}
        edges={["top"]}
      >

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.back}
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


          <View
            style={styles.headerContent}
          >

            <Text style={styles.title}>
              {category === "All"
                ? "All Products"
                : category}
            </Text>

            <Text style={styles.sub}>
              Browse our menu
            </Text>

          </View>

        </View>


        <View style={styles.errorContainer}>

          <View style={styles.errorIcon}>

            <Ionicons
              name="cloud-offline-outline"
              size={55}
              color={colors.primary}
            />

          </View>


          <Text style={styles.errorTitle}>
            Could not load products
          </Text>


          <Text style={styles.errorText}>
            {errorMessage}
          </Text>


          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadProducts}
          >

            <Ionicons
              name="refresh"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.retryText}>
              Try Again
            </Text>

          </TouchableOpacity>

        </View>

      </SafeAreaView>
    );
  }


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (
      <SafeAreaView
        style={styles.safe}
        edges={["top"]}
      >

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.back}
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


          <View
            style={styles.headerContent}
          >

            <Text style={styles.title}>
              {category === "All"
                ? "All Products"
                : category}
            </Text>

            <Text style={styles.sub}>
              Browse our menu
            </Text>

          </View>

        </View>


        <View style={styles.center}>

          <ActivityIndicator
            size="large"
            color={colors.primary}
          />


          <Text style={styles.muted}>
            Loading products...
          </Text>

        </View>

      </SafeAreaView>
    );
  }


  // ==========================================
  // MAIN SCREEN
  // ==========================================

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >

      {/* HEADER */}

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


        <View
          style={styles.headerContent}
        >

          <Text style={styles.title}>
            {category === "All"
              ? "All Products"
              : category}
          </Text>


          <Text style={styles.sub}>
            {visibleProducts.length} products
          </Text>

        </View>

      </View>


      {/* PRODUCTS */}

      <FlatList
        data={visibleProducts}
        numColumns={2}

        keyExtractor={(item) =>
          item.id
        }

        renderItem={renderProduct}

        columnWrapperStyle={
          styles.row
        }

        contentContainerStyle={
          styles.list
        }

        showsVerticalScrollIndicator={
          false
        }

        ListEmptyComponent={

          <View
            style={
              styles.emptyContainer
            }
          >

            <Ionicons
              name="fast-food-outline"
              size={55}
              color={colors.primary}
            />


            <Text style={styles.empty}>
              No products found
            </Text>


            <Text
              style={styles.emptySub}
            >
              {category === "All"
                ? "No products have been added yet."
                : `No products found in ${category}.`}
            </Text>

          </View>
        }

      />

    </SafeAreaView>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({

    safe: {
      flex: 1,
      backgroundColor:
        colors.background,
    },


    // =========================
    // HEADER
    // =========================

    header: {
      backgroundColor:
        colors.primary,

      paddingHorizontal: 15,
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
      color: "#FFFFFF",
      fontSize: 21,
      fontWeight: "900",
    },


    sub: {
      color:
        "rgba(255,255,255,0.8)",

      marginTop: 3,
      fontSize: 13,
    },


    // =========================
    // PRODUCT LIST
    // =========================

    list: {
      padding: 16,
      paddingBottom: 100,
    },


    row: {
      justifyContent:
        "space-between",
    },


    // =========================
    // PRODUCT CARD
    // =========================

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
      height: 145,

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


    cat: {
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


    out: {
      fontSize: 11,
      color: colors.danger,
      fontWeight: "800",
      marginTop: 4,
    },


    // =========================
    // LOADING
    // =========================

    center: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",
    },


    muted: {
      color: colors.muted,
      marginTop: 8,
    },


    // =========================
    // EMPTY
    // =========================

    emptyContainer: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 30,
      paddingTop: 150,
    },


    empty: {
      fontSize: 20,
      fontWeight: "800",

      color: colors.text,

      marginTop: 12,
    },


    emptySub: {
      textAlign: "center",

      fontSize: 13,

      color: colors.muted,

      marginTop: 6,
    },


    // =========================
    // ERROR
    // =========================

    errorContainer: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 30,
    },


    errorIcon: {
      width: 100,
      height: 100,

      borderRadius: 50,

      backgroundColor:
        "rgba(255,100,40,0.10)",

      alignItems: "center",
      justifyContent: "center",

      marginBottom: 18,
    },


    errorTitle: {
      fontSize: 21,
      fontWeight: "900",

      color: colors.text,

      textAlign: "center",
    },


    errorText: {
      color: colors.muted,

      fontSize: 13,

      lineHeight: 20,

      textAlign: "center",

      marginTop: 8,
    },


    retryButton: {
      marginTop: 20,

      backgroundColor:
        colors.primary,

      borderRadius: 15,

      paddingHorizontal: 24,
      paddingVertical: 13,

      flexDirection: "row",
      alignItems: "center",

      gap: 8,
    },


    retryText: {
      color: "#FFFFFF",

      fontSize: 15,

      fontWeight: "900",
    },

  });