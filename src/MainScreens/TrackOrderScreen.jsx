import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebaseConfig";
import { colors } from "../design/theme";

const steps = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const labels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackOrderScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const ordersQuery = query(
      collection(db, "Orders"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort(
            (a, b) =>
              (b.createdAt?.seconds || 0) -
              (a.createdAt?.seconds || 0)
          );

        setOrders(data);
        setLoading(false);
      },
      (error) => {
        console.log("Orders error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="bicycle"
          size={27}
          color="#FFFFFF"
        />

        <Text style={styles.headerTitle}>
          My Orders
        </Text>
      </View>

      {/* Orders */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {orders.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="receipt-outline"
              size={60}
              color={colors.primary}
            />

            <Text style={styles.emptyTitle}>
              No orders yet
            </Text>

            <Text style={styles.muted}>
              Your placed orders will appear here.
            </Text>
          </View>
        ) : (
          orders.map((order) => {
            const currentStep = steps.indexOf(
              order.status
            );

            return (
              <View
                key={order.id}
                style={styles.order}
              >
                {/* Order Header */}
                <View style={styles.orderTop}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>
                      Order #{order.id.slice(0, 7)}
                    </Text>

                    <Text style={styles.muted}>
                      {order.address ||
                        "Address not provided"}
                    </Text>
                  </View>

                  <Text style={styles.total}>
                    Rs. {order.total || 0}
                  </Text>
                </View>

                {/* Cancelled */}
                {order.status === "cancelled" ? (
                  <View style={styles.cancel}>
                    <Text style={styles.cancelText}>
                      Order cancelled
                    </Text>
                  </View>
                ) : (
                  /* Order Timeline */
                  <View style={styles.timeline}>
                    {steps.map((step, index) => {
                      const isActive =
                        index <= currentStep;

                      const isConnectorActive =
                        index < currentStep;

                      return (
                        <View
                          key={step}
                          style={styles.step}
                        >
                          <View
                            style={[
                              styles.dot,
                              isActive &&
                                styles.activeDot,
                            ]}
                          >
                            {isActive && (
                              <Ionicons
                                name="checkmark"
                                size={12}
                                color="#FFFFFF"
                              />
                            )}
                          </View>

                          <Text
                            style={[
                              styles.stepText,
                              isActive &&
                                styles.activeText,
                            ]}
                          >
                            {labels[step]}
                          </Text>

                          {index <
                            steps.length - 1 && (
                            <View
                              style={[
                                styles.connector,
                                isConnectorActive &&
                                  styles.activeConnector,
                              ]}
                            />
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Ordered Items */}
                <View style={styles.items}>
                  {(order.items || []).map(
                    (item, index) => (
                      <Text
                        key={`${order.id}-${index}`}
                        style={styles.item}
                      >
                        {item.name} ×{" "}
                        {item.quantity ||
                          item.qty ||
                          1}
                      </Text>
                    )
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  order: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderInfo: {
    flex: 1,
    paddingRight: 10,
  },

  orderId: {
    fontWeight: "900",
    fontSize: 15,
    color: colors.text,
  },

  muted: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },

  total: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },

  timeline: {
    marginTop: 20,
  },

  step: {
    minHeight: 35,
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8E1DD",
    alignItems: "center",
    justifyContent: "center",
  },

  activeDot: {
    backgroundColor: colors.primary,
  },

  stepText: {
    marginLeft: 10,
    color: "#999999",
    fontWeight: "600",
    fontSize: 12,
  },

  activeText: {
    color: colors.text,
  },

  connector: {
    position: "absolute",
    left: 11,
    top: 24,
    width: 2,
    height: 11,
    backgroundColor: "#E8E1DD",
  },

  activeConnector: {
    backgroundColor: colors.primary,
  },

  items: {
    borderTopWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
    paddingTop: 10,
  },

  item: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },

  cancel: {
    backgroundColor: "#FFF0F0",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  cancelText: {
    color: colors.danger,
    fontWeight: "800",
  },

  empty: {
    alignItems: "center",
    paddingVertical: 100,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 15,
    color: colors.text,
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});