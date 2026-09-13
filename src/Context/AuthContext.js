import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as fbSignOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const REMEMBER_KEY = "@auth/remember";

const AuthContext = createContext({
  user: null,
  loading: true,
  remember: true,
  setRemember: () => {},
  signOut: async () => {},
  clearPersistedSession: async () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default true so the legacy UX (stay logged in) is preserved until the user
  // actively opts out. We block rendering of children until the stored value
  // is read so the AuthProvider and AsyncStorage don't disagree on first paint.
  const [remember, setRememberState] = useState(true);
  const [rememberReady, setRememberReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(REMEMBER_KEY);
        if (stored === "false") setRememberState(false);
      } catch {
        // ignore — default true
      } finally {
        setRememberReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const setRemember = async (value) => {
    setRememberState(value);
    try {
      await AsyncStorage.setItem(REMEMBER_KEY, value ? "true" : "false");
    } catch {
      // best-effort; the in-memory state still applies for this session
    }
  };

  const signOut = async () => {
    await fbSignOut(auth);
  };

  const clearPersistedSession = async () => {
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, remember, setRemember, signOut, clearPersistedSession }}
    >
      {/* Only render the navigation tree once we know the persisted remember
          preference, otherwise AppNav could wipe an unwanted-but-cached
          session on first launch. */}
      {rememberReady ? children : null}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
