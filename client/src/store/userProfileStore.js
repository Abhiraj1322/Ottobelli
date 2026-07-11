import axios from "axios";
import {create} from'zustand'
const userProfileStore= create((set,get)=>({
    profiles: [],
  activeProfile: null,
  isLoading: false,

fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/profiles');
      set({ 
        profiles: res.data, 
        activeProfile: res.data[0] || null, 
        isLoading: false 
      });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  setActiveProfile: (profileId) => {
    const target = get().profiles.find(p => p._id === profileId);
    set({ activeProfile: target || null });
  },

  updateMeasurements: async (profileId, measurements) => {
    try {
      const res = await axios.put(`/api/profiles/${profileId}/measurements`, { measurements });
      
      // Update local tracking instantly
      set((state) => ({
        profiles: state.profiles.map(p => p._id === profileId ? res.data : p),
        activeProfile: state.activeProfile?._id === profileId ? res.data : state.activeProfile
      }));
    } catch (err) {
      console.error('Failed to update measurements structural matrix.');
    }
  }
  
}))
export default userProfileStore