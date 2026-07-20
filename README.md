# Smart Survey - Field Inspection App

A React Native mobile application built with **Expo SDK 54** designed for field inspectors to execute surveys, capture location details, register contacts, and collect inspection data efficiently.

---

## 🚀 Key Features

*   **Flat Expo Routing System**: Utilizes file-based routes for efficient routing without complex directory nesting.
*   **Survey Form & Inspections**: Includes fields for Site Name, Client Name, Description, Date, and Priorities (Low, Medium, High, Critical).
*   **Integrated Device APIs**:
    *   📷 **Camera View** (`expo-camera`): Capture site photos directly inside the app, view previews, and attach them to surveys.
    *   📍 **GPS Coordinates** (`expo-location`): Fetch real-time device coordinates (latitude, longitude, accuracy) and bind them to inspection reports.
    *   👥 **Contacts Management** (`expo-contacts`): Add contact details manually, select/autofill existing contacts from your phone, and create new contacts in your device's address book from the contacts screen.
    *   📋 **Clipboard Utilities** (`expo-clipboard`): Easy copy/paste capabilities for phone numbers and coordinate details.
*   **Themed Layout**: Responsive design with support for automatic **Light/Dark theme switching**.
*   **Navigation**: Side Drawer sidebar for fast transitions, alongside tabbed layouts for dashboard, history, profile, and survey management.

---

## 📂 Folder Structure

```text
Asignment-React-Native/
├── app/                      # Application route layouts (Expo Router)
│   ├── (tabs)/               # Bottom tab screens
│   │   ├── _layout.tsx       # Bottom tabs navigator configuration
│   │   ├── history.tsx       # History of all inspect surveys
│   │   ├── index.tsx         # Dashboard / Inspector home screen
│   │   ├── new-survey.tsx    # Survey creation form (with Camera, GPS, Contact picker)
│   │   └── profile.tsx       # Inspector profile screen
│   ├── _layout.tsx           # Application root layout & Stack/Drawer setup
│   ├── camera.tsx            # Dedicated Camera capture utility screen
│   ├── clipboard.tsx         # Clipboard screen for pasting/verifying copied survey values
│   ├── contacts.tsx          # Device contact list viewer & Add Contact creator
│   ├── location.tsx          # Real-time GPS coordinate fetcher & viewer
│   ├── preview.tsx           # Full Survey details viewer & preview screen
│   └── settings.tsx          # Application preferences & Theme settings
├── assets/                   # Shared image, icon, and font assets
├── components/               # Reusable UI component library
│   ├── ui/                   # Sub-components and primitives
│   ├── ActionCard.tsx        # Dashboard quick action item
│   ├── AppHeader.tsx         # Standardized screen header layout
│   ├── DrawerSidebar.tsx     # Customized drawer sidebar component
│   ├── EmptyState.tsx        # Standard fallback for empty lists/searches
│   ├── SurveyCard.tsx        # Visual card for survey summaries
│   ├── external-link.tsx     # Web link opening wrapper
│   ├── haptic-tab.tsx        # Bottom tab button with haptic feedback
│   ├── hello-wave.tsx        # Animated welcome wave hand
│   ├── parallax-scroll-view.tsx # Scroll view with parallax header image effects
│   ├── themed-text.tsx       # Custom Text wrapper supporting dark/light colors
│   └── themed-view.tsx       # Custom View wrapper supporting dark/light colors
├── constants/                # Theme settings and type definitions
│   ├── theme.ts              # Theme color maps for light/dark modes
│   └── types.ts              # Global TypeScript models (Survey, Contact, Profile)
├── hooks/                    # Reusable stateful hooks
│   ├── use-color-scheme.ts   # Dark/light theme color scheme utility hook
│   ├── use-color-scheme.web.ts # Web compatibility utility hook
│   └── use-theme-color.ts    # Custom color palette mapper hook
├── store/                    # Contexts for local application state
│   ├── DrawerContext.tsx     # Custom sidebar drawer open/close context
│   └── SurveyContext.tsx     # Main mock/persistent surveys & profile storage context
├── package.json              # App metadata and dependency declarations
├── tsconfig.json             # TypeScript compiler settings configuration
└── app.json                  # Expo config file
