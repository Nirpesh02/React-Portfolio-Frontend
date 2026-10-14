import { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  isFirebaseConfigured,
} from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const BlogAuthContext = createContext(null);

export const BlogAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Directly listen to Firebase Auth session in browser
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Google User",
            avatar:
              firebaseUser.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                firebaseUser.displayName || "Google User"
              )}&background=4285F4&color=fff&bold=true`,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Google Sign-In with Firebase
  const loginWithGoogle = async () => {
    if (auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Google User",
          avatar:
            firebaseUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              firebaseUser.displayName || "Google User"
            )}&background=4285F4&color=fff&bold=true`,
        };
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return userData;
      } catch (error) {
        console.error("Google sign in error:", error);
        if (error.code === "auth/popup-closed-by-user") {
          toast.info("Google Sign-In was cancelled");
        } else if (error.code === "auth/operation-not-allowed") {
          toast.error("Google Sign-In Firebase Console मा Enable गरिएको छैन! कृपया Firebase Console मा गएर Google Enable गर्नुहोस्।");
        } else if (error.code === "auth/unauthorized-domain") {
          toast.error("यो डोमेन Firebase Authorized Domains मा छैन। कृपया localhost लाई Authorized Domains मा थप्नुहोस्।");
        } else {
          toast.error(error.message || "Failed to sign in with Google");
        }
        return null;
      }
    } else {
      toast.warning("Firebase सुरु भइरहेको छ... कृपया पेज रिफ्रेस (F5) गर्नुहोस्।");
      return null;
    }
  };

  // Sign out
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("SignOut error:", e);
      }
    }
    setUser(null);
    toast.info("Signed out from Google");
  };

  return (
    <BlogAuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </BlogAuthContext.Provider>
  );
};

export const useBlogAuth = () => {
  const context = useContext(BlogAuthContext);
  if (!context) {
    throw new Error("useBlogAuth must be used within a BlogAuthProvider");
  }
  return context;
};
