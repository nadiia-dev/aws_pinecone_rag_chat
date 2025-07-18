import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthStore = {
  email: string;
  loginUser: (newEmail: string) => void;
  logoutUser: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      email: "",
      loginUser: (newEmail) => set({ email: newEmail }),
      logoutUser: () => {
        set({ email: "" });
        localStorage.removeItem("userEmail");
      },
    }),
    {
      name: "userEmail",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
