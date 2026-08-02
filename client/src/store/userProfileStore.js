import axios from "axios";
import {create} from'zustand'
const userProfileStore= create((set,get)=>({
    profiles: [],
  activeProfile: null,
  isLoading: false,

// 1. Fetch user profile list and populate active profile
  fetchProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/profiles");
      const profiles = res.data.profiles || res.data;

      // Check local storage for previously saved active ID, or pick first profile
      const savedActiveId = localStorage.getItem("activeProfileId");
      const active =
        profiles.find((p) => p._id === savedActiveId) || profiles[0] || null;

      set({
        profiles,
        activeProfile: active,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to fetch profiles",
      });
    }
  },

  // 2. Switch active profile (Optimistic update + rollback on error)
  switchProfile: async (profileId) => {
    const previousActive = get().activeProfile;
    const targetProfile = get().profiles.find((p) => p._id === profileId);

    if (!targetProfile) return;

    // 1. Optimistic local UI update
    set({ activeProfile: targetProfile });
    localStorage.setItem("activeProfileId", profileId);

    // 2. Sync change with MongoDB server
    try {
      await axios.put("/api/profiles/switch", { profileId });
    } catch (error) {
      console.error("Failed to update active profile on server:", error);
      // Revert back if backend call fails
      set({ activeProfile: previousActive });
      if (previousActive) {
        localStorage.setItem("activeProfileId", previousActive._id);
      }
    }
  },

  // 3. Create a new profile
  createProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post("/api/profiles", profileData);
      const newProfile = res.data.profile || res.data;

      set((state) => {
        const updatedProfiles = [...state.profiles, newProfile];
        // If this is the user's first profile, automatically set it as active
        const newActive = state.activeProfile ? state.activeProfile : newProfile;

        return {
          profiles: updatedProfiles,
          activeProfile: newActive,
          isLoading: false,
        };
      });

      if (!get().activeProfile) {
        localStorage.setItem("activeProfileId", newProfile._id);
      }

      return { success: true, profile: newProfile };
    } catch (err) {
      set({ isLoading: false });
      return {
        success: false,
        error: err.response?.data?.message || "Failed to create profile",
      };
    }
  },

  // 4. Update measurements for a specific profile
  updateMeasurements: async (profileId, measurements) => {
    try {
      const res = await axios.put(`/api/profiles/${profileId}/measurements`, {
        measurements,
      });
      const updatedProfile = res.data.profile || res.data;

      set((state) => ({
        profiles: state.profiles.map((p) =>
          p._id === profileId ? updatedProfile : p
        ),
        activeProfile:
          state.activeProfile?._id === profileId
            ? updatedProfile
            : state.activeProfile,
      }));

      return { success: true };
    } catch (err) {
      console.error("Failed to update measurements:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update measurements",
      };
    }
  },

  // 5. Delete profile with fallback active profile setting
  deleteProfile: async (profileId) => {
    try {
      await axios.delete(`/api/profiles/${profileId}`);

      set((state) => {
        const remainingProfiles = state.profiles.filter(
          (p) => p._id !== profileId
        );
        let nextActive = state.activeProfile;

        // If active profile was deleted, switch to first available or null
        if (state.activeProfile?._id === profileId) {
          nextActive = remainingProfiles.length > 0 ? remainingProfiles[0] : null;
          if (nextActive) {
            localStorage.setItem("activeProfileId", nextActive._id);
          } else {
            localStorage.removeItem("activeProfileId");
          }
        }

        return {
          profiles: remainingProfiles,
          activeProfile: nextActive,
        };
      });
    } catch (err) {
      console.error("Failed to delete profile:", err);
    }
  },
  
}))
export default userProfileStore