# Project Analysis: Event Manager App

A detailed analysis of the **Event Manager App** codebase. This document outlines the technology stack, project architecture, implementation status of various modules, and recommendations for future development.

---

## 🚀 Technology Stack

The application is built using a modern, performant, and type-safe front-end stack:

| Technology | Purpose | Version |
| :--- | :--- | :--- |
| **React** | Core library for building the UI | `^19.2.7` |
| **TypeScript** | Type safety and enhanced developer tooling | `~6.0.2` |
| **Vite** | Build tool and fast development server | `^8.1.1` |
| **React Router** | Client-side routing (v7) | `^7.18.1` |
| **Tailwind CSS** | Styling engine (v4 with Vite plugin integration) | `^4.3.2` |
| **TanStack Query** | Async state management & server caching | `^5.101.2` |
| **Axios** | HTTP requests and API client | `^1.18.1` |
| **React Hook Form** | Flexible form handling and validation | `^7.81.0` |
| **Zod** | Schema validation | `^4.4.3` |
| **Recharts** | Interactive charts and data visualizations | `^3.8.0` |

---

## 📂 Project Structure & Architecture

The project adheres to a **Domain-Driven Feature Layout**, which helps keep modules cohesive and easy to scale.

```
c:/code/event-manager-app/
├── src/
│   ├── api/             # Axios instance & interceptors config
│   ├── components/      # Global shared components
│   │   ├── common/      # Reusable UI widgets (Loading, ConfirmDialog, etc.)
│   │   ├── forms/       # Global form fields
│   │   ├── layout/      # Sidebar, Header, Logo components
│   │   └── ui/          # Low-level UI primitives (buttons, cards, labels, input)
│   ├── config/          # Global configuration (navigation options, etc.)
│   ├── context/         # React Context providers (Sidebar, Auth)
│   ├── features/        # Domain-driven features
│   │   ├── auth/        # Login, Registration, authentication APIs/hooks
│   │   ├── calendar/    # Calendar grid, daily focus panel, calendar hooks
│   │   ├── dashboard/   # Dashboard widgets, stats cards, revenue charts
│   │   ├── event-types/ # Category and tag management (Placeholder)
│   │   ├── events/      # Multi-step Event Wizard (Boilerplate)
│   │   ├── payments/    # Financials and receipts management (Placeholder)
│   │   ├── services/    # Vendors/Service catalog (Placeholder)
│   │   └── settings/    # User & Workspace preferences (Placeholder)
│   ├── layouts/         # Layout components (MainLayout, AuthLayout, AppLayout)
│   ├── providers/       # Context & library providers wrapper (QueryProvider)
│   ├── routes/          # Route configs using React Router v7 browser router
│   ├── types/           # Global TypeScript type definitions
│   └── utils/           # Shared utility helper functions
```

---

## 🔍 Module-by-Module Assessment

### 🔐 1. Authentication (`src/features/auth`)
* **Pages**: [LoginPage](file:///c:/code/event-manager-app/src/features/auth/pages/LoginPage.tsx), [RegisterPage](file:///c:/code/event-manager-app/src/features/auth/pages/RegisterPage.tsx).
* **Components**: Login/Register forms, password field toggles, split visual hero layouts.
* **Mechanism**: Interacts with API `/auth/login` and `/auth/register`. On success, sets `accessToken` and `user` inside `localStorage`.
* **State**: Direct redirection based on `localStorage` tokens inside [ProtectedRoute.tsx](file:///c:/code/event-manager-app/src/routes/ProtectedRoute.tsx) and [AuthLayout.tsx](file:///c:/code/event-manager-app/src/layouts/AuthLayout.tsx).
* > [!WARNING]
  > The [AuthContext.tsx](file:///c:/code/event-manager-app/src/context/AuthContext.tsx) file is currently empty (0 bytes). Authentication state should be managed via a proper provider to ensure reactive state updates across the app.

---

### 📊 2. Dashboard (`src/features/dashboard`)
* **Page**: [DashboardPage](file:///c:/code/event-manager-app/src/features/dashboard/pages/DashboardPage.tsx).
* **Components**:
  * **Stat Cards**: Display today's events, upcoming events, pending revenue, and total revenue with micro-progress bars and change percentages.
  * **Schedule Card**: Shows daily timeline schedule items (in-progress, draft, upcoming) along with participant badges.
  * **Revenue Chart**: Implements an interactive area chart visual using Recharts with weekly/monthly toggles.
  * **Featured Event Card**: Displays the flagship event card with background image cover.

---

### 📅 3. Calendar (`src/features/calendar`)
* **Page**: [CalendarPage](file:///c:/code/event-manager-app/src/features/calendar/pages/CalendarPage.tsx).
* **Components**:
  * **Calendar Grid**: Standard 7-column calendar monthly grid that maps events onto specific day cells.
  * **Selected Day Panel**: Interactive side-panel showing detailed events list when a calendar date is clicked.
  * **useCalendar Hook**: Implements custom navigation (next month, previous month, go to today) and manages selected date states.

---

### 🧙‍♂️ 4. Events (`src/features/events`)
* **Page**: [EventsPage](file:///c:/code/event-manager-app/src/features/events/pages/EventsPage.tsx), [CreateEventPage](file:///c:/code/event-manager-app/src/features/events/pages/CreateEventPage.tsx).
* **Components**: Renders the multi-step `EventWizard` wrapper.
* > [!NOTE]
  > The wizard features four steps (`EventDetailsStep`, `ClientInformationStep`, `VenueServicesStep`, and `ReviewStep`), but these step components are currently skeletal placeholders with no form fields or user inputs.

---

### 🚧 5. Placeholder Pages
The following features are completely boilerplate and render simple title headers:
* [PaymentsPage](file:///c:/code/event-manager-app/src/features/payments/pages/PaymentsPage.tsx) (`<h1>Payments</h1>`)
* [ServicesPage](file:///c:/code/event-manager-app/src/features/services/pages/ServicesPage.tsx) (`<h1>Services</h1>`)
* [EventTypesPage](file:///c:/code/event-manager-app/src/features/event-types/pages/EventTypesPage.tsx) (`<h1>Event Types</h1>`)
* [SettingsPage](file:///c:/code/event-manager-app/src/features/settings/pages/SettingsPage.tsx) (`<h1>Settings</h1>`)

---

## 🛠️ Actionable Recommendations

### ⚡ Priority 1: Implement AuthContext
Provide a centralized React Context state inside [AuthContext.tsx](file:///c:/code/event-manager-app/src/context/AuthContext.tsx) to prevent components from directly reading/writing `localStorage`. This will allow hooks like logout or profile updates to reactively re-render components.

### ✍️ Priority 2: Build Event Wizard Step Forms
Inject interactive form fields into the wizard steps:
1. **EventDetailsStep**: Input event title, description, start/end date, type, and capacity.
2. **ClientInformationStep**: Contact details, phone, email, organization.
3. **VenueServicesStep**: Venue dropdown, catering, A/V, styling selections.
4. **ReviewStep**: Summary table before trigger.
Validate each step with Zod schema resolution using `react-hook-form`.

### 🎨 Priority 3: Elevate Placeholder Views
Flesh out the empty views:
1. **Payments**: Add transaction tables, invoice details, download receipts buttons, and payment status badges.
2. **Services**: Service cards (Vendor, Category, Pricing, Availability).
3. **Event Types**: Event template definitions (e.g. Wedding, Conference, Meeting) with customizable fields.
4. **Settings**: Profile configuration, light/dark mode switch, workspace branding.
