import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebaseConfig";
import { CartContext } from "../Context/CartContext";
import { colors, shadow } from "../design/theme";
import { loadSavedLocation } from "../utils/location";

export default function UserCartScreen({ navigation }) {
  const {
    items,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async () => {
    if (!auth.currentUser) {
      Alert.alert(
        "Login required",
        "Please login first."
      );
      return;
    }

    if (!items.length) {
      Alert.alert(
        "Cart is empty",
        "Add something delicious first."
      );
      return;
    }

    if (!address.trim()) {
      Alert.alert(
        "Delivery address",
        "Please enter your delivery address."
      );
      return;
    }

    try {
      setLoading(true);

      // Get saved user location
      const location = await loadSavedLocation();

      // Get restaurant settings
      const settingsRef = doc(
        db,
        "RestaurantSettings",
        "main"
      );

      const settingsSnapshot = await getDoc(
        settingsRef
      );

      const settings = settingsSnapshot.exists()
        ? settingsSnapshot.data()
        : {};

      const radius = Number(
        settings.deliveryRadiusKm || 0
      );

      // =========================
      // DELIVERY RADIUS CHECK
      // =========================

      if (
        radius > 0 &&
        location?.latitude &&
        location?.longitude &&
        settings.address
      ) {
        const Location = require("expo-location");

        const geocoded = await Location.geocodeAsync(
          settings.address
        );

        const restaurantLocation =
          geocoded?.[0];

        if (restaurantLocation) {
          const toRad = (value) =>
            (value * Math.PI) / 180;

          const dLat = toRad(
            location.latitude -
              restaurantLocation.latitude
          );

          const dLon = toRad(
            location.longitude -
              restaurantLocation.longitude
          );

          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(
              toRad(restaurantLocation.latitude)
            ) *
              Math.cos(toRad(location.latitude)) *
              Math.sin(dLon / 2) ** 2;

          const distance =
            6371 *
            2 *
            Math.atan2(
              Math.sqrt(a),
              Math.sqrt(1 - a)
            );

          if (distance > radius) {
            throw new Error(
              `Your location is ${distance.toFixed(
                1
              )} km away. This restaurant accepts orders within ${radius} km.`
            );
          }
        }
      }

      // =========================
      // CREATE ORDER
      // =========================

      await addDoc(collection(db, "Orders"), {
        userId: auth.currentUser.uid,

        customerName:
          auth.currentUser.displayName ||
          auth.currentUser.email ||
          "Customer",

        customerEmail:
          auth.currentUser.email || "",

        items,

        total: Number(total),

        status: "pending",

        paymentStatus: "unpaid",

        paymentMethod: "COD",

        address: address.trim(),

        location: location || null,

        createdAt: serverTimestamp(),
      });

      // Clear cart
      clearCart();

      setAddress("");

      // Success message
      Alert.alert(
        "Order placed 🎉",
        "Your order has been sent to the restaurant.",
        [
          {
            text: "Track Order",
            onPress: () =>
              navigation.navigate(
                "TrackOrder"
              ),
          },
        ]
      );
    } catch (error) {
      console.log(
        "Place Order Error:",
        error
      );

      Alert.alert(
        "Error",
        error.message ||
          "Could not place your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  const renderEmptyCart = () => {
    return (
      <View style={styles.empty}>
        <Ionicons
          name="cart-outline"
          size={65}
          color={colors.primary}
        />

        <Text style={styles.emptyTitle}>
          Your cart is empty
        </Text>

        <Text style={styles.emptySub}>
          Add your favourite food from the
          home screen.
        </Text>

        <TouchableOpacity
          style={styles.browse}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("Home", {
              screen: "HomeMain",
            })
          }
        >
          <Text style={styles.browseText}>
            Browse Menu
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // =========================
  // CART ITEM
  // =========================

  const renderCartItem = (item) => {
    return (
      <View
        key={item.id}
        style={styles.item}
      >
        <Image
          style={styles.image}
          source={
            item.imageUrl
              ? { uri: item.imageUrl }
              : require("../Images/Biryani2.jpg")
          }
        />

        <View style={styles.itemBody}>
          <View style={styles.itemTop}>
            <Text style={styles.itemName}>
              {item.name}
            </Text>

            <TouchableOpacity
              onPress={() =>
                removeFromCart(item.id)
              }
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>
            Rs. {item.price}
          </Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                updateQuantity(
                  item.id,
                  item.quantity - 1
                )
              }
            >
              <Text style={styles.qtyBtnText}>
                −
              </Text>
            </TouchableOpacity>

            <Text style={styles.qty}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                updateQuantity(
                  item.id,
                  item.quantity + 1
                )
              }
            >
              <Text style={styles.qtyBtnText}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // =========================
  // MAIN UI
  // =========================

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Your Cart
        </Text>

        <Text style={styles.count}>
          {items.length} items
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            {/* Cart Items */}
            {items.map(renderCartItem)}

            {/* Order Summary */}
            <View style={styles.summary}>
              <View style={styles.line}>
                <Text>Subtotal</Text>

                <Text>
                  Rs. {total}
                </Text>
              </View>

              <View style={styles.line}>
                <Text>
                  Delivery fee
                </Text>

                <Text>
                  Rs. 0
                </Text>
              </View>

              <View
                style={styles.divider}
              />

              <View style={styles.line}>
                <Text
                  style={styles.totalLabel}
                >
                  Total
                </Text>

                <Text style={styles.total}>
                  Rs. {total}
                </Text>
              </View>
            </View>

            {/* Delivery Address */}
            <Text style={styles.sectionTitle}>
              Delivery address
            </Text>

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="House, street, area..."
              placeholderTextColor="#AAA"
              style={styles.input}
              multiline
            />

            {/* Payment Method */}
            <View style={styles.cod}>
              <Ionicons
                name="cash-outline"
                size={24}
                color={colors.primary}
              />

              <View>
                <Text style={styles.codTitle}>
                  Cash on Delivery
                </Text>

                <Text style={styles.codSub}>
                  Payment will be collected on
                  delivery.
                </Text>
              </View>
            </View>

            {/* Place Order */}
            <TouchableOpacity
              style={[
                styles.orderBtn,
                loading && styles.disabledBtn,
              ]}
              onPress={placeOrder}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.orderText}>
                {loading
                  ? "Placing Order..."
                  : `Place Order • Rs. ${total}`}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================
// STYLES
// =========================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    padding: 18,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 23,
    fontWeight: "900",
    color: colors.text,
  },

  count: {
    color: colors.muted,
    fontWeight: "700",
  },

  content: {
    padding: 16,
    paddingBottom: 35,
  },

  // =========================
  // CART ITEM
  // =========================

  item: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    flexDirection: "row",
    marginBottom: 10,
    overflow: "hidden",
    ...shadow,
  },

  image: {
    width: 100,
    height: 105,
    resizeMode: "cover",
  },

  itemBody: {
    flex: 1,
    padding: 12,
  },

  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    flex: 1,
  },

  price: {
    color: colors.primary,
    fontWeight: "900",
    marginTop: 5,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 9,
  },

  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  qtyBtnText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "800",
  },

  qty: {
    fontWeight: "900",
    color: colors.text,
  },

  // =========================
  // SUMMARY
  // =========================

  summary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 5,
    ...shadow,
  },

  line: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },

  totalLabel: {
    fontWeight: "900",
    fontSize: 17,
    color: colors.text,
  },

  total: {
    fontWeight: "900",
    fontSize: 19,
    color: colors.primary,
  },

  // =========================
  // ADDRESS
  // =========================

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 20,
    marginBottom: 8,
    color: colors.text,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    minHeight: 70,
    padding: 14,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },

  // =========================
  // PAYMENT
  // =========================

  cod: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    ...shadow,
  },

  codTitle: {
    fontWeight: "900",
    color: colors.text,
  },

  codSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },

  // =========================
  // ORDER BUTTON
  // =========================

  orderBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },

  disabledBtn: {
    opacity: 0.6,
  },

  orderText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },

  // =========================
  // EMPTY CART
  // =========================

  empty: {
    alignItems: "center",
    paddingVertical: 80,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 15,
    color: colors.text,
  },

  emptySub: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 6,
  },

  browse: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
  },

  browseText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});