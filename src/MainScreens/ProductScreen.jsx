import React, {
  useContext,
  useState,
} from "react";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import { CartContext } from "../Context/CartContext";

import {
  colors,
  gradients,
  shadow,
} from "../design/theme";


export default function ProductScreen({
  navigation,
  route,
}) {
  // =========================
  // Product
  // =========================

  const product =
    route?.params?.product || {};

  const {
    addToCart,
  } = useContext(CartContext);

  const [
    quantity,
    setQuantity,
  ] = useState(1);


  // =========================
  // Product Information
  // =========================

  const name =
    product.Name ||
    product.name ||
    "Food Item";

  const price =
    Number(product.price || 0);

  const category =
    product.category ||
    product.categoryId ||
    "Food";

  const description =
    product.description ||
    "Freshly prepared with delicious ingredients. Enjoy it hot and fresh.";


  // =========================
  // Add To Cart
  // =========================

  const handleAddToCart = () => {
    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product);
    }

    Alert.alert(
      "Added to cart",
      `${name} added to your cart.`
    );
  };


  // =========================
  // Buy Now
  // =========================

  const handleBuyNow = () => {
    handleAddToCart();

    navigation.navigate(
      "Cart"
    );
  };


  // =========================
  // Quantity
  // =========================

  const decreaseQuantity = () => {
    setQuantity(
      Math.max(
        1,
        quantity - 1
      )
    );
  };


  const increaseQuantity = () => {
    setQuantity(
      quantity + 1
    );
  };


  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >

      {/* =========================
          Top Header
      ========================= */}

      <View style={styles.top}>

        <TouchableOpacity
          style={styles.circle}
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


        <Text style={styles.topTitle}>
          Food Details
        </Text>


        <TouchableOpacity
          style={styles.circle}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(
              "Cart"
            )
          }
        >
          <Ionicons
            name="cart-outline"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

      </View>


      {/* =========================
          Product Content
      ========================= */}

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* Product Image */}

        <Image
          style={styles.image}
          source={
            product.imageUrl
              ? {
                  uri:
                    product.imageUrl,
                }
              : require("../Images/Biryani2.jpg")
          }
        />


        {/* Product Details Card */}

        <View style={styles.card}>

          {/* Title + Price */}

          <View
            style={styles.titleRow}
          >

            <View
              style={
                styles.titleContainer
              }
            >

              <Text
                style={styles.name}
              >
                {name}
              </Text>

              <Text
                style={
                  styles.category
                }
              >
                {category}
              </Text>

            </View>


            <Text
              style={styles.price}
            >
              Rs. {price}
            </Text>

          </View>


          {/* About Product */}

          <View
            style={styles.info}
          >

            <Text
              style={
                styles.infoTitle
              }
            >
              About this item
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {description}
            </Text>

          </View>


          {/* Quantity */}

          <View
            style={styles.qtyRow}
          >

            <Text
              style={styles.qtyLabel}
            >
              Quantity
            </Text>


            <View
              style={
                styles.qtyControls
              }
            >

              <TouchableOpacity
                style={styles.qtyBtn}
                activeOpacity={0.8}
                onPress={
                  decreaseQuantity
                }
              >
                <Text
                  style={
                    styles.qtyText
                  }
                >
                  −
                </Text>
              </TouchableOpacity>


              <Text
                style={styles.qty}
              >
                {quantity}
              </Text>


              <TouchableOpacity
                style={styles.qtyBtn}
                activeOpacity={0.8}
                onPress={
                  increaseQuantity
                }
              >
                <Text
                  style={
                    styles.qtyText
                  }
                >
                  +
                </Text>
              </TouchableOpacity>

            </View>

          </View>


          {/* Restaurant */}

          <LinearGradient
            colors={
              gradients.primary
            }
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={
              styles.restaurant
            }
          >

            <Ionicons
              name="restaurant-outline"
              size={22}
              color="#FFFFFF"
            />

            <View
              style={
                styles.restaurantInfo
              }
            >

              <Text
                style={
                  styles.restaurantTitle
                }
              >
                Jafz Go Karo
              </Text>

              <Text
                style={
                  styles.restaurantSub
                }
              >
                Fresh food • Fast delivery
              </Text>

            </View>

          </LinearGradient>


          {/* Add To Cart */}

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.button}
            onPress={
              handleAddToCart
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              Add to Cart • Rs.{" "}
              {price * quantity}
            </Text>

          </TouchableOpacity>


          {/* Buy Now */}

          <TouchableOpacity
            activeOpacity={0.9}
            style={
              styles.orderOutline
            }
            onPress={
              handleBuyNow
            }
          >

            <Text
              style={
                styles.orderText
              }
            >
              Buy Now
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

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


  scrollContent: {
    paddingBottom: 30,
  },


  // =========================
  // Header
  // =========================

  top: {
    height: 62,

    paddingHorizontal: 16,

    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    backgroundColor:
      colors.primary,
  },


  circle: {
    width: 40,
    height: 40,

    borderRadius: 14,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    alignItems: "center",

    justifyContent: "center",
  },


  topTitle: {
    color: "#FFFFFF",

    fontSize: 17,

    fontWeight: "900",
  },


  // =========================
  // Product Image
  // =========================

  image: {
    width: "100%",
    height: 260,

    resizeMode: "cover",
  },


  // =========================
  // Details Card
  // =========================

  card: {
    marginTop: -18,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    backgroundColor:
      colors.background,

    padding: 18,
  },


  titleRow: {
    flexDirection: "row",

    alignItems: "center",
  },


  titleContainer: {
    flex: 1,
  },


  name: {
    fontSize: 27,

    fontWeight: "900",

    color: colors.text,
  },


  category: {
    color: colors.primary,

    fontWeight: "800",

    marginTop: 4,
  },


  price: {
    fontSize: 21,

    fontWeight: "900",

    color: colors.primary,

    marginLeft: 10,
  },


  // =========================
  // Description
  // =========================

  info: {
    backgroundColor:
      colors.surface,

    borderRadius: 18,

    padding: 15,

    marginTop: 18,

    ...shadow,
  },


  infoTitle: {
    fontSize: 16,

    fontWeight: "900",

    color: colors.text,
  },


  description: {
    color: colors.muted,

    lineHeight: 21,

    marginTop: 7,
  },


  // =========================
  // Quantity
  // =========================

  qtyRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    marginVertical: 18,
  },


  qtyLabel: {
    fontSize: 16,

    fontWeight: "900",

    color: colors.text,
  },


  qtyControls: {
    flexDirection: "row",

    alignItems: "center",

    gap: 12,
  },


  qtyBtn: {
    width: 36,
    height: 36,

    borderRadius: 12,

    backgroundColor:
      colors.surface,

    alignItems: "center",

    justifyContent: "center",

    ...shadow,
  },


  qtyText: {
    fontSize: 24,

    color: colors.primary,

    fontWeight: "700",
  },


  qty: {
    fontSize: 17,

    fontWeight: "900",

    minWidth: 20,

    textAlign: "center",

    color: colors.text,
  },


  // =========================
  // Restaurant
  // =========================

  restaurant: {
    borderRadius: 18,

    padding: 15,

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    marginBottom: 14,
  },


  restaurantInfo: {
    flex: 1,
  },


  restaurantTitle: {
    color: "#FFFFFF",

    fontWeight: "900",
  },


  restaurantSub: {
    color:
      "rgba(255,255,255,0.85)",

    fontSize: 11,

    marginTop: 3,
  },


  // =========================
  // Add To Cart
  // =========================

  button: {
    backgroundColor:
      colors.primary,

    borderRadius: 16,

    padding: 16,

    alignItems: "center",
  },


  buttonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "900",
  },


  // =========================
  // Buy Now
  // =========================

  orderOutline: {
    marginTop: 10,

    borderWidth: 1.5,

    borderColor:
      colors.primary,

    borderRadius: 16,

    padding: 15,

    alignItems: "center",
  },


  orderText: {
    color: colors.primary,

    fontWeight: "900",

    fontSize: 16,
  },

});