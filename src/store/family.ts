import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type FamilyState = {
  currentFamilyId: string | null;
  setCurrentFamilyId: (familyId: string | null) => void;
};

export const useFamilyStore = create<FamilyState>()(
  devtools(
    persist(
      (set) => ({
        currentFamilyId: null,
        setCurrentFamilyId: (familyId) => set({ currentFamilyId: familyId }),
      }),
      {
        name: "familyStore",
      },
    ),
    { name: "familyStore" },
  ),
);

export const useCurrentFamilyId = () =>
  useFamilyStore((state) => state.currentFamilyId);

export const useSetCurrentFamilyId = () =>
  useFamilyStore((state) => state.setCurrentFamilyId);
