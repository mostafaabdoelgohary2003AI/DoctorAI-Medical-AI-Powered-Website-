import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  isRTL: boolean;
  sidebarOpen: boolean;
  notifications: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
  }[];
}

// Get initial sidebar state from localStorage or default to true
const getSavedSidebarState = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  }
  return true;
};

const initialState: UIState = {
  theme: 'light',
  language: 'en',
  isRTL: false,
  sidebarOpen: getSavedSidebarState(),
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      
      // Apply theme to document
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      
      // Apply theme to document
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
      state.isRTL = action.payload === 'ar';
      
      // Apply RTL to document
      if (state.isRTL) {
        document.documentElement.dir = 'rtl';
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.remove('rtl');
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarOpen', JSON.stringify(state.sidebarOpen));
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarOpen', JSON.stringify(state.sidebarOpen));
      }
    },
    addNotification: (
      state,
      action: PayloadAction<{
        type: 'info' | 'success' | 'warning' | 'error';
        message: string;
      }>
    ) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setLanguage,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;