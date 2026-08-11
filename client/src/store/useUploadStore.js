import { create } from "zustand";
import api from "../api/axios"; // Adjust path to your axios/api instance

const useUploadStore = create((set,get) => ({
  // State
  uploadedUrl: "",
  uploadedUrls: [], // Initialized array to prevent undefined errors
  loading: false,
  error: null,

  uploadPhoto: async (file) => {
    if (!file) {
      set({ error: "Please select a file before submitting." });
      return null;
    }

    const formData = new FormData();
    formData.append("photo", file); // Must match upload.single("photo") in Express

    set({ loading: true, error: null });

    try {
      // Send request using your pre-configured api client
      const res = await api.post("api/upload/reference-photo", formData);

      // Extract public URL returned by backend
      const fileUrl = res.data.url;

      set((state) => ({
        uploadedUrl: fileUrl,
        uploadedUrls: [...state.uploadedUrls, fileUrl],
        loading: false,
      }));

      return fileUrl; // Returns uploaded URL string
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to upload image.";
      console.error("Failed to upload image:", err);
      set({ error: errorMessage, loading: false });
      return null;
    }
  },
  uploadPhotos: async (files) => {
    if (!files || files.length === 0) return [];

    set({ loading: true, error: null });

    try {
      const fileArray = Array.from(files);

      // Concurrently upload each file using the single uploadPhoto action
      const uploadPromises = fileArray.map((file) => get().uploadPhoto(file));
      const urls = await Promise.all(uploadPromises);

      // Filter out any failed null uploads
      const successfulUrls = urls.filter(Boolean);

      set({ loading: false });
      return successfulUrls; // Returns array of uploaded URL strings
    } catch (err) {
      console.error("Failed batch upload:", err);
      set({ error: "One or more files failed to upload", loading: false });
      return [];
    }
  },

  // Helper to reset upload state if needed
  resetUploadState: () => set({ error: null, uploadedUrl: "", uploadedUrls: [] }),
}));

export default useUploadStore;