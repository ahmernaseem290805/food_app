import * as Location from "expo-location";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

export async function getCurrentLocationLabel() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Location permission was denied.");
  const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = position.coords;
  const places = await Location.reverseGeocodeAsync({ latitude, longitude });
  const place = places?.[0] || {};
  const area = place.district || place.subregion || place.street || "";
  const city = place.city || place.region || "";
  const label = [area, city].filter(Boolean).join(", ") || "Current location";
  return { latitude, longitude, area, city, label };
}

export async function loadSavedLocation() {
  if (!auth.currentUser) return null;
  const snap = await getDoc(doc(db, "UserProfiles", auth.currentUser.uid));
  return snap.exists() ? snap.data().location || null : null;
}

export async function saveLocation(location) {
  if (!auth.currentUser) return;
  await setDoc(doc(db, "UserProfiles", auth.currentUser.uid), { location }, { merge: true });
}
