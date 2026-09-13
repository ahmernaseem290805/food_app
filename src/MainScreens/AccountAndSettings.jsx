import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { AuthContext } from "../Context/AuthContext";

import {
  auth,
  db,
} from "../../firebase/firebaseConfig";

import { colors } from "../design/theme";

import {
  getCurrentLocationLabel,
  loadSavedLocation,
  saveLocation,
} from "../utils/location";


export default function AccountAndSettings({
  navigation,
}) {

  const {
    user,
    signOut,
  } = useContext(AuthContext);


  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [location, setLocation] =
    useState(null);

  const [address, setAddress] =
    useState(null);

  const [busy, setBusy] =
    useState(false);

  const [loadingAddress, setLoadingAddress] =
    useState(true);


  // ==================================================
  // LOAD LOCATION + ADDRESS
  // ==================================================

  useEffect(() => {

    loadLocation();

    loadAddress();

  }, [user]);


  const loadLocation = async () => {
    try {

      const saved =
        await loadSavedLocation();

      setLocation(saved);

    } catch (error) {

      console.log(
        "Location loading error:",
        error
      );

    }
  };


  const loadAddress = async () => {

    if (!user) {
      setLoadingAddress(false);
      return;
    }

    try {

      const profileRef =
        doc(
          db,
          "UserProfiles",
          user.uid
        );

      const profileSnap =
        await getDoc(profileRef);


      if (profileSnap.exists()) {

        const data =
          profileSnap.data();

        setAddress(
          data.deliveryAddress ||
          null
        );

      }

    } catch (error) {

      console.log(
        "Address loading error:",
        error
      );

    } finally {

      setLoadingAddress(false);

    }
  };


  // ==================================================
  // CHANGE CURRENT LOCATION
  // ==================================================

  const changeLocation = async () => {

    try {

      setBusy(true);

      const loc =
        await getCurrentLocationLabel();

      await saveLocation(loc);

      setLocation(loc);

      Alert.alert(
        "Location updated",
        loc.label
      );

    } catch (error) {

      Alert.alert(
        "Location",
        error?.message ||
        "Could not update location."
      );

    } finally {

      setBusy(false);

    }
  };


  // ==================================================
  // RENDER ROW
  // ==================================================

  const renderRow = (
    icon,
    title,
    onPress,
    danger = false
  ) => {

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={onPress}
        activeOpacity={0.8}
      >

        <Ionicons
          name={icon}
          size={23}
          color={
            danger
              ? colors.danger
              : colors.primary
          }
        />

        <Text
          style={[
            styles.rowText,
            danger &&
              styles.dangerText,
          ]}
        >
          {title}
        </Text>

        <Ionicons
          name="chevron-forward"
          size={18}
          color="#AAA"
        />

      </TouchableOpacity>
    );
  };


  // ==================================================
  // MAIN
  // ==================================================

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Settings
        </Text>

        <Text style={styles.sub}>
          {user?.email}
        </Text>

      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* BODY */}

        <View style={styles.body}>


          {/* ==========================================
              DELIVERY LOCATION
          ========================================== */}

          <Text style={styles.section}>
            Delivery Location
          </Text>


          <TouchableOpacity
            style={styles.location}
            onPress={changeLocation}
            activeOpacity={0.8}
          >

            <Ionicons
              name="location-outline"
              size={24}
              color={colors.primary}
            />


            <View
              style={styles.locationContent}
            >

              <Text
                style={styles.locationTitle}
              >
                {location?.label ||
                  "Use current location"}
              </Text>

              <Text
                style={styles.locationSub}
              >
                Automatically detect your
                city and area
              </Text>

            </View>


            {busy ? (

              <ActivityIndicator
                color={colors.primary}
              />

            ) : (

              <Ionicons
                name="refresh"
                size={20}
                color={colors.primary}
              />

            )}

          </TouchableOpacity>


          {/* ==========================================
              DELIVERY ADDRESS
          ========================================== */}

          <Text style={styles.section}>
            Delivery Address
          </Text>


          <View
            style={styles.addressInfo}
          >

            <View
              style={styles.addressHeader}
            >

              <Ionicons
                name="home-outline"
                size={22}
                color={colors.primary}
              />

              <Text
                style={styles.addressTitle}
              >
                Saved Address
              </Text>

            </View>


            {/* ADDRESS */}

            {loadingAddress ? (

              <View
                style={styles.addressLoading}
              >

                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                />

                <Text
                  style={styles.loadingText}
                >
                  Loading address...
                </Text>

              </View>

            ) : address ? (

              <View
                style={styles.addressDetails}
              >

                <View
                  style={styles.addressLine}
                >

                  <Text
                    style={styles.addressLabel}
                  >
                    Area / Society
                  </Text>

                  <Text
                    style={styles.addressValue}
                  >
                    {address.area ||
                      "Not provided"}
                  </Text>

                </View>


                <View
                  style={styles.addressLine}
                >

                  <Text
                    style={styles.addressLabel}
                  >
                    House Number
                  </Text>

                  <Text
                    style={styles.addressValue}
                  >
                    {address.houseNumber ||
                      "Not provided"}
                  </Text>

                </View>


                <View
                  style={[
                    styles.addressLine,
                    styles.lastAddressLine,
                  ]}
                >

                  <Text
                    style={styles.addressLabel}
                  >
                    Street Number
                  </Text>

                  <Text
                    style={styles.addressValue}
                  >
                    {address.streetNumber ||
                      "Not provided"}
                  </Text>

                </View>

              </View>

            ) : (

              <View
                style={styles.noAddress}
              >

                <Ionicons
                  name="alert-circle-outline"
                  size={22}
                  color="#999"
                />

                <Text
                  style={styles.noAddressText}
                >
                  No delivery address saved.
                </Text>

              </View>

            )}


            {/* INFO MESSAGE */}

            <View
              style={styles.addressNote}
            >

              <Ionicons
                name="information-circle-outline"
                size={17}
                color={colors.primary}
              />

              <Text
                style={styles.addressNoteText}
              >
                You can change your delivery
                address from Profile Settings.
              </Text>

            </View>

          </View>


          {/* ==========================================
              ACCOUNT
          ========================================== */}

          {renderRow(
            "person-outline",
            "My Profile",
            () =>
              navigation.navigate(
                "Profile"
              )
          )}


          {/* ==========================================
              ORDERS
          ========================================== */}

          {renderRow(
            "receipt-outline",
            "My Orders",
            () =>
              navigation.navigate(
                "TrackOrder"
              )
          )}


          {/* ==========================================
              SUPPORT
          ========================================== */}

          {renderRow(
            "help-circle-outline",
            "Help & Support",
            () =>
              Alert.alert(
                "Support",
                "Please contact the restaurant for help."
              )
          )}


          {/* ==========================================
              LOGOUT
          ========================================== */}

          {renderRow(
            "log-out-outline",
            "Logout",
            () =>
              Alert.alert(
                "Logout",
                "Are you sure?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Logout",
                    style: "destructive",
                    onPress: signOut,
                  },
                ]
              ),
            true
          )}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // HEADER

  header: {
    backgroundColor: colors.primary,

    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  sub: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontSize: 13,
  },

  // SCROLL

  scrollContent: {
    paddingBottom: 30,
  },

  body: {
    padding: 16,
  },

  // SECTION

  section: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
    color: colors.text,
  },

  // CURRENT LOCATION

  location: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 15,

    flexDirection: "row",
    alignItems: "center",

    gap: 12,

    marginBottom: 20,
  },

  locationContent: {
    flex: 1,
  },

  locationTitle: {
    fontWeight: "900",
    color: colors.text,
    fontSize: 15,
  },

  locationSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 3,
  },

  // SAVED ADDRESS

  addressInfo: {
    backgroundColor: "#FFFFFF",

    borderRadius: 18,

    padding: 16,

    marginBottom: 18,
  },

  addressHeader: {
    flexDirection: "row",
    alignItems: "center",

    gap: 9,

    paddingBottom: 13,

    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  addressTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },

  addressDetails: {
    paddingTop: 5,
  },

  addressLine: {
    paddingVertical: 11,

    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  lastAddressLine: {
    borderBottomWidth: 0,
  },

  addressLabel: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 3,
  },

  addressValue: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },

  // ADDRESS LOADING

  addressLoading: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 18,

    gap: 10,
  },

  loadingText: {
    color: colors.muted,
    fontSize: 12,
  },

  // NO ADDRESS

  noAddress: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 16,

    gap: 8,
  },

  noAddressText: {
    color: colors.muted,
    fontSize: 13,
  },

  // NOTE

  addressNote: {
    backgroundColor:
      "rgba(255,100,40,0.08)",

    borderRadius: 12,

    padding: 11,

    marginTop: 8,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },

  addressNoteText: {
    flex: 1,

    color: colors.primary,

    fontSize: 11,

    fontWeight: "700",

    lineHeight: 17,
  },

  // ROWS

  row: {
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 17,

    marginBottom: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 13,
  },

  rowText: {
    flex: 1,

    fontSize: 15,

    fontWeight: "800",

    color: colors.text,
  },

  dangerText: {
    color: colors.danger,
  },

});