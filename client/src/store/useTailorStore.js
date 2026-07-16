import { create } from 'zustand';
import api from "../api/axios";



export const useTailorStore = create((set, get) => ({
  // --- STATE ---
  profiles: [],
  selectedProfileId: null,
  activeProduct: null,
  currentSelections: {},
  cart: [],

  // UI Modal Visibility States
  isMeasurementModalOpen: false,
  isCustomizationModalOpen: false,
  isProfileGateOpen: false,

  // --- ACTIONS ---

  // 1. Profile Management
  fetchProfiles: async () => {
    try {
      const res = await api.get('/profiles'); // Fetch profiles from backend
      set({ profiles: res.data.profiles });
      // Default to first profile if available
      if (res.data.profiles.length > 0 && !get().selectedProfileId) {
        set({ selectedProfileId: res.data.profiles[0]._id });
      }
    } catch (err) {
      console.error("Failed to fetch profiles", err);
    }
  },

  addOrUpdateProfile: async (profileData) => {
    try {
      let res;
      if (profileData._id) {
        res = await api.put(`/profiles/${profileData._id}`, profileData);
      } else {
        res = await api.post('/profiles', profileData);
      }
      
      // Refresh profiles list
      await get().fetchProfiles();
      set({ selectedProfileId: res.data.profile._id });
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  },

  setSelectedProfileId: (id) => set({ selectedProfileId: id }),

  // 2. Customization Selections
  setCustomizationSelections: (selections) => set({ currentSelections: selections }),
  updateSingleSelection: (key, value) => set((state) => ({
    currentSelections: { ...state.currentSelections, [key]: value }
  })),

  // 3. Modals Control
  openMeasurementModal: () => set({ isMeasurementModalOpen: true, isProfileGateOpen: false }),
  closeMeasurementModal: () => set({ isMeasurementModalOpen: false }),
  
  openProfileGate: () => set({ isProfileGateOpen: true }),
  closeProfileGate: () => set({ isProfileGateOpen: false }),

  openCustomizer: (product) => {
    // Generate default selections based on product customization options
    const initial = {};
    product.customizationOptions?.forEach((group) => {
      if (group.options?.length > 0) {
        initial[group.groupName] = group.options[0].label;
      }
    });
    set({
      activeProduct: product,
      currentSelections: initial,
      isCustomizationModalOpen: true,
      isProfileGateOpen: false
    });
  },
  closeCustomizer: () => set({ isCustomizationModalOpen: false, activeProduct: null }),

  // 4. Cart Logic with Mandatory Profile Selection Gate
  handleAddToCart: (product) => {
    // Check if the item belongs to Classics (Made to Measure / Customizable)[cite: 1]
    const isCustomizable = product.isCustomizable; 

    if (!isCustomizable) {
      // "Everyday Wear" off-the-rack items bypass all requirements
      get().addToCartDirect(product);
      return;
    }

    // It IS customizable! We must check if they have selected a profile[cite: 1]
    const state = get();
    
    if (state.profiles.length === 0) {
      // Force them to make a measurement profile first!
      set({ activeProduct: product });
      get().openMeasurementModal();
      return;
    }

    if (!state.selectedProfileId) {
      // Profile exists but none is currently highlighted/selected, open the gate
      set({ activeProduct: product });
      get().openProfileGate();
      return;
    }

    // Profile and product are ready, open the customizer panel[cite: 1]
    get().openCustomizer(product);
  },

  // Save customization to DB, then bundle everything to cart
  saveCustomizationAndAddToCart: async () => {
    const { activeProduct, selectedProfileId, currentSelections } = get();
    
    try {
      // Post to your customizable API router
      const res = await api.post('/customizations', {
        productId: activeProduct._id,
        profileId: selectedProfileId,
        selections: currentSelections
      });

      const customizationId = res.data.customization._id;

      // Append finalized item to cart state
      set((state) => ({
        cart: [...state.cart, {
          productId: activeProduct._id,
          name: activeProduct.name,
          price: activeProduct.price,
          customizationId,
          profileId: selectedProfileId,
          isCustom: true,
          quantity: 1
        }],
        isCustomizationModalOpen: false,
        activeProduct: null
      }));

      alert("Bespoke item added to cart successfully!");
    } catch (err) {
      console.error("Error saving customized item to cart", err);
    }
  },

  addToCartDirect: (product) => {
    set((state) => ({
      cart: [...state.cart, {
        productId: product._id,
        name: product.name,
        price: product.price,
        isCustom: false,
        quantity: 1
      }]
    }));
    alert(`${product.name} added to cart!`);
  }
}));