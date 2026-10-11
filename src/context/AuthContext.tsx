import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from "../lib/firebase";
import { UserProfile, JobLocation, NoticePeriod } from "../types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile;
  loading: boolean;
  authError: string | null;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: () => void;
  logout: () => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => void;
  clearAuthError: () => void;
}

const defaultProfile: UserProfile = {
  uid: "demo-user-1",
  email: "ramakrishna.janhvi@careerpilot.ai",
  displayName: "Ramakrishna Janhvi",
  targetRoles: ["Full Stack Developer", "Backend Engineer", "Node.js / React Specialist"],
  preferredCities: ["Hyderabad", "Bengaluru", "Pune"],
  minLpa: 12,
  noticePeriodDays: 30,
  wfhPreference: true,
  experienceYears: 2.5,
  careerGoal: "Targeting Senior Backend / Full-Stack roles (14-22 LPA) in fast-paced product engineering teams.",
  isGuest: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("careerpilot_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setProfile((prev) => {
          const updated: UserProfile = {
            ...prev,
            uid: firebaseUser.uid,
            email: firebaseUser.email || prev.email,
            displayName: firebaseUser.displayName || prev.displayName,
            photoURL: firebaseUser.photoURL || undefined,
            isGuest: false,
          };
          localStorage.setItem("careerpilot_profile", JSON.stringify(updated));
          return updated;
        });
      } else {
        // Check if demo user was active
        const saved = localStorage.getItem("careerpilot_profile");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.isGuest) {
              // Maintain guest session
              setLoading(false);
              return;
            }
          } catch (e) {}
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      const code = err?.code || "";
      let msg = "Failed to sign in. Please check your credentials.";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      } else if (code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please try again later.";
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      const updatedProfile: UserProfile = {
        ...profile,
        uid: userCredential.user.uid,
        email: email,
        displayName: name || email.split("@")[0],
        isGuest: false,
      };
      setProfile(updatedProfile);
      localStorage.setItem("careerpilot_profile", JSON.stringify(updatedProfile));
    } catch (err: any) {
      const code = err?.code || "";
      let msg = "Failed to create account.";
      if (code === "auth/email-already-in-use") {
        msg = "An account with this email already exists.";
      } else if (code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError(err.message || "Failed to sign in with Google.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInAsDemo = () => {
    const demoProf: UserProfile = {
      ...defaultProfile,
      isGuest: true,
    };
    setUser(null);
    setProfile(demoProf);
    localStorage.setItem("careerpilot_profile", JSON.stringify(demoProf));
    setAuthError(null);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem("careerpilot_profile");
    setProfile({
      ...defaultProfile,
      uid: "guest-" + Date.now(),
      displayName: "Guest Candidate",
      email: "guest@careerpilot.ai",
      isGuest: true,
    });
  };

  const updateProfileData = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("careerpilot_profile", JSON.stringify(next));
      return next;
    });
  };

  const isAuthenticated = !!user || profile.isGuest === true;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsDemo,
        logout,
        updateProfileData,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
