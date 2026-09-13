import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  updateProfile,
} from "firebase/auth";

import { LinearGradient } from "expo-linear-gradient";

import { AuthContext } from "../Context/AuthContext";

import {
  auth,
  db,
  storage,
} from "../../firebase/firebaseConfig";

import {
  getCurrentLocationLabel,
  saveLocation,
} from "../utils/location";

import {
  colors,
  gradients,
} from "../design/theme";


export default function UserProfile({ navigation }) {
  const { user } = useContext(AuthContext);

  // --------------------------------------------------
  // Profile State
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState(null);

  // --------------------------------------------------
  // Delivery Address State
  // --------------------------------------------------

  const [area, setArea] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [streetNumber, setStreetNumber] = useState("");

  // --------------------------------------------------
  // Other State
  // --------------------------------------------------

  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState("");


  // ==================================================
  // LOAD PROFILE
  // ==================================================

  useEffect(() => {
    loadUserProfile();
  }, [user]);


  const loadUserProfile = async () => {
    if (!user) {
      setLoadingProfile(false);
      return;
    }

    try {
      const profileRef = doc(
        db,
        "UserProfiles",
        user.uid
      );

      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const data = profileSnap.data();

        setName(
          data.name ||
          user.displayName ||
          ""
        );

        setPhone(
          data.phone ||
          ""
        );

        setPhoto(
          data.photoURL ||
          user.photoURL ||
          ""
        );

        setLocation(
          data.location ||
          null
        );

        // Delivery address
        setArea(
          data.deliveryAddress?.area ||
          ""
        );

        setHouseNumber(
          data.deliveryAddress?.houseNumber ||
          ""
        );

        setStreetNumber(
          data.deliveryAddress?.streetNumber ||
          ""
        );
      } else {
        setName(user.displayName || "");
        setPhoto(user.photoURL || "");
      }
    } catch (error) {
      console.log(
        "Profile loading error:",
        error
      );
    } finally {
      setLoadingProfile(false);
    }
  };


  // ==================================================
  // PICK PROFILE PICTURE
  // ==================================================

  const pickProfilePicture = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          "Photo permission is required."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!result.canceled) {
        const selectedImage =
          result.assets[0]?.uri;

        if (selectedImage) {
          setPhoto(selectedImage);
        }
      }
    } catch (error) {
      console.log(
        "Image picker error:",
        error
      );

      showMessage(
        "Could not select the picture."
      );
    }
  };


  // ==================================================
  // CHANGE LOCATION
  // ==================================================

  const refreshLocation = async () => {
    try {
      setMessage("Fetching location...");

      const currentLocation =
        await getCurrentLocationLabel();

      await saveLocation(currentLocation);

      setLocation(currentLocation);

      showMessage(
        "✓ Location updated"
      );
    } catch (error) {
      console.log(
        "Location error:",
        error
      );

      showMessage(
        error?.message ||
        "Could not get your location."
      );
    }
  };


  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const saveProfile = async () => {
    if (!user) {
      showMessage(
        "Please login first."
      );
      return;
    }

    // Validate address
    if (!area.trim()) {
      Alert.alert(
        "Delivery Address",
        "Please enter your area or society name."
      );
      return;
    }

    if (!houseNumber.trim()) {
      Alert.alert(
        "Delivery Address",
        "Please enter your house number."
      );
      return;
    }

    if (!streetNumber.trim()) {
      Alert.alert(
        "Delivery Address",
        "Please enter your street number."
      );
      return;
    }

    try {
      Keyboard.dismiss();

      setSaving(true);

      let photoURL = photo;


      // ----------------------------------------------
      // Upload Profile Picture
      // ----------------------------------------------

      if (
        photo &&
        photo.startsWith("file://")
      ) {
        const response =
          await fetch(photo);

        const blob =
          await response.blob();

        const storageRef =
          ref(
            storage,
            `profilePictures/${user.uid}/profile.jpg`
          );

        await uploadBytes(
          storageRef,
          blob,
          {
            contentType: "image/jpeg",
          }
        );

        photoURL =
          await getDownloadURL(
            storageRef
          );
      }


      // ----------------------------------------------
      // Update Firebase Auth
      // ----------------------------------------------

      await updateProfile(
        auth.currentUser,
        {
          displayName: name.trim(),
          photoURL: photoURL || null,
        }
      );


      // ----------------------------------------------
      // Save Firestore Profile
      // ----------------------------------------------

      await setDoc(
        doc(
          db,
          "UserProfiles",
          user.uid
        ),
        {
          name: name.trim(),
          phone: phone.trim(),

          email:
            user.email || "",

          photoURL:
            photoURL || "",

          location:
            location || null,

          deliveryAddress: {
            area: area.trim(),
            houseNumber: houseNumber.trim(),
            streetNumber: streetNumber.trim(),
          },
        },
        {
          merge: true,
        }
      );


      // ----------------------------------------------
      // Update UI
      // ----------------------------------------------

      setPhoto(photoURL);

      showMessage(
        "✓ Changes saved"
      );

    } catch (error) {
      console.log(
        "Profile save error:",
        error
      );

      showMessage(
        "Could not save changes."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==================================================
  // TOAST
  // ==================================================

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loadingProfile) {
    return (
      <SafeAreaView
        style={styles.loadingScreen}
        edges={["top"]}
      >
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }


  // ==================================================
  // MAIN SCREEN
  // ==================================================

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top"]}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          My Profile
        </Text>

        <View style={styles.headerSpacer} />

      </View>


      {/* TOAST */}

      {message ? (
        <View style={styles.toast}>

          <Ionicons
            name="checkmark-circle"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.toastText}>
            {message}
          </Text>

        </View>
      ) : null}


      {/* CONTENT */}

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* PROFILE PHOTO */}

        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={pickProfilePicture}
          activeOpacity={0.9}
        >

          {photo ? (
            <Image
              source={{ uri: photo }}
              style={styles.avatar}
            />
          ) : (
            <LinearGradient
              colors={gradients.primary}
              style={styles.avatar}
            >
              <Ionicons
                name="person"
                size={55}
                color="#FFFFFF"
              />
            </LinearGradient>
          )}

          <View style={styles.cameraButton}>

            <Ionicons
              name="camera"
              size={18}
              color="#FFFFFF"
            />

          </View>

        </TouchableOpacity>


        <Text style={styles.changePhotoText}>
          Tap to change profile picture
        </Text>


        {/* FULL NAME */}

        <Text style={styles.label}>
          Full Name
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />

        {/* PHONE NUMBER */}
        <Text style={styles.label}>
          Phone Number
        </Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="phone-pad"
          returnKeyType="next"
        />


        {/* EMAIL */}

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          value={user?.email || ""}
          editable={false}
          style={[
            styles.input,
            styles.disabledInput,
          ]}
        />


        {/* DELIVERY LOCATION */}

        <Text style={styles.sectionTitle}>
          Delivery Location
        </Text>

        <View style={styles.locationBox}>

          <View style={styles.locationIcon}>

            <Ionicons
              name="location"
              size={21}
              color={colors.primary}
            />

          </View>


          <View style={styles.locationContent}>

            <Text
              style={styles.locationText}
              numberOfLines={2}
            >
              {location?.label ||
                "No location saved"}
            </Text>

            <Text style={styles.locationHint}>
              Your current delivery location
            </Text>

          </View>


          <TouchableOpacity
            onPress={refreshLocation}
            style={styles.changeLocationButton}
            activeOpacity={0.7}
          >
            <Text style={styles.changeLocationText}>
              Change
            </Text>
          </TouchableOpacity>

        </View>


        {/* DELIVERY ADDRESS */}

        <Text style={styles.sectionTitle}>
          Delivery Address
        </Text>

        <Text style={styles.addressHint}>
          Enter your complete delivery address
        </Text>


        {/* AREA / SOCIETY */}

        <Text style={styles.label}>
          Area / Society Name
        </Text>

        <TextInput
          value={area}
          onChangeText={setArea}
          placeholder="e.g. Paragon City"
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="next"
        />


        {/* HOUSE NUMBER */}

        <Text style={styles.label}>
          House Number
        </Text>

        <TextInput
          value={houseNumber}
          onChangeText={setHouseNumber}
          placeholder="e.g. House 123"
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="next"
        />


        {/* STREET NUMBER */}

        <Text style={styles.label}>
          Street
        </Text>

        <TextInput
          value={streetNumber}
          onChangeText={setStreetNumber}
          placeholder="e.g. StreetName/StreetNo"
          placeholderTextColor="#999"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />


        {/* SAVE */}

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving &&
              styles.disabledButton,
          ]}
          onPress={saveProfile}
          disabled={saving}
          activeOpacity={0.85}
        >

          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                Save Changes
              </Text>
            </>
          )}

        </TouchableOpacity>

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

  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 14,
  },

  // HEADER

  header: {
    backgroundColor: colors.primary,

    paddingHorizontal: 16,
    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "center",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  backButton: {
    width: 40,
    height: 40,

    borderRadius: 14,

    backgroundColor:
      "rgba(255,255,255,0.18)",

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,

    marginLeft: 14,

    color: "#FFFFFF",

    fontSize: 21,
    fontWeight: "900",
  },

  headerSpacer: {
    width: 40,
  },

  // TOAST

  toast: {
    position: "absolute",

    top: 75,
    left: 18,
    right: 18,

    zIndex: 100,

    backgroundColor: "#222222",

    paddingHorizontal: 15,
    paddingVertical: 13,

    borderRadius: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    elevation: 8,
  },

  toastText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  // BODY

  body: {
    padding: 18,
    paddingBottom: 50,
  },

  // AVATAR

  avatarWrapper: {
    alignSelf: "center",
    position: "relative",
  },

  avatar: {
    width: 115,
    height: 115,

    borderRadius: 58,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#DDDDDD",
  },

  cameraButton: {
    position: "absolute",

    right: 2,
    bottom: 2,

    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: colors.primary,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 3,
    borderColor: colors.background,
  },

  changePhotoText: {
    textAlign: "center",

    color: colors.muted,

    fontSize: 12,

    marginTop: 9,
  },

  // LABELS

  label: {
    fontSize: 14,
    fontWeight: "800",

    color: colors.text,

    marginTop: 19,
    marginBottom: 7,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",

    color: colors.text,

    marginTop: 24,
    marginBottom: 8,
  },

  addressHint: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },

  // INPUT

  input: {
    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,

    borderRadius: 15,

    paddingHorizontal: 14,
    paddingVertical: 13,

    color: colors.text,

    fontSize: 15,
  },

  disabledInput: {
    color: "#999999",
    backgroundColor: "#F1F1F1",
  },

  // LOCATION

  locationBox: {
    backgroundColor: colors.surface,

    borderRadius: 15,

    padding: 14,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: colors.border,
  },

  locationIcon: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor:
      "rgba(255,100,40,0.10)",

    alignItems: "center",
    justifyContent: "center",
  },

  locationContent: {
    flex: 1,

    marginLeft: 9,
    marginRight: 8,
  },

  locationText: {
    color: colors.text,

    fontWeight: "700",

    fontSize: 14,
  },

  locationHint: {
    color: colors.muted,

    fontSize: 11,

    marginTop: 3,
  },

  changeLocationButton: {
    paddingHorizontal: 5,
    paddingVertical: 8,
  },

  changeLocationText: {
    color: colors.primary,

    fontWeight: "900",

    fontSize: 13,
  },

  // SAVE

  saveButton: {
    backgroundColor: colors.primary,

    borderRadius: 16,

    paddingVertical: 16,

    marginTop: 25,

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",

    gap: 8,

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.15,

    shadowRadius: 6,
  },

  saveButtonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "900",
  },

  disabledButton: {
    opacity: 0.6,
  },

});