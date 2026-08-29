# 🇮🇳 NIVO — Indian Freelancer Production & Booking Manager

<p align="center">
  <img src="public/login-bg.jpg" alt="NIVO Banner" width="100%" style="border-radius: 16px;" />
</p>

> **NIVO** is a modern, full-stack event production and booking management application designed specifically for **Indian Creative Freelancers** (Photographers, Videographers, DJs, Anchors/MCs, MUAs, Decorators, and Sound Engineers).

---

## ✨ Key Features & Capabilities

### 📅 1. Smart 4-Step Booking Wizard
- **Event Information**: Title, Event Type (Wedding, Sangeet, Corporate, Photoshoot, Gala, Concert), Date, Schedule & Status.
- **Client Contact**: Client Name, Email, and Phone Number.
- **Venue & Services**: Venue Name, Full Address, and Multi-Service Selector with quantity steppers (`hrs`, `gst`, `qty`).
- **Review & Confirm**: Production duration estimator, Event Notes, Payment Advance Input with quick percentage chips (`0%`, `25%`, `30%`, `50%`), and Instant WhatsApp Draft Generator.

---

### 📲 2. Instant WhatsApp Client Confirmation Drafts
- **Automated Booking Text**: Auto-populates itemized booking details, schedule, venue, and **Payment Breakdown** (`Total Amount`, `Advance Paid`, `Pending Balance`).
- **Personalized Studio Sign-Off**: Signs off with your registered **Studio / Business Name** (e.g., *— Rohan Photography*).
- **One-Tap Actions**:
  - **Copy Draft**: Instant clipboard copy with feedback.
  - **Send on WhatsApp**: Launches WhatsApp Web / Mobile directly populated with the client message.

---

### 🎨 3. Black & White Theme-Adaptive Event Cards
- **Spacious Pattern Outlines**: Transparent canvas rendering subtle geometric icon wallpaper outlines in silver/white (Dark Mode) or charcoal (Light Mode) with spacious `140px` spacing.
- **High-Contrast Badges**: Distinct colorful status pills (`Confirmed` 🟢, `Pending` 🟠, `Completed` 🔵, `Cancelled` 🔴) and category chips.

---

### 🗓️ 4. Visual Interactive Calendar
- **Shaadi & Muhurat Conflict Prevention**: Color-coded date tiles to manage peak Indian wedding dates and prevent double-booking.
- **Selected Day Side Panel**: Quick summary of scheduled events, start/end times, and client details for any day clicked.

---

### 💼 5. Services & Flexible Rate Cards
- **Image-Independent Icon Architecture**: Dynamic category Lucide icons (`Camera`, `Video`, `Music`, `Utensils`, `Palette`, `Shield`, `Truck`, `Sparkles`, `Briefcase`).
- **Pricing Models**: Flat Rate (`₹ Flat`), Hourly Rate (`₹/hr`), and Per Guest (`₹/guest`).
- **Live Preview Box & Floating CTA**: Real-time live card preview while editing and an expandable floating save button (`bg-emerald-500` active status toggle).

---

### 💳 6. Rupee-First Payments & Mobile Touch Cards
- **Indian Rupee (₹) Default**: All transaction records, billing summaries, and invoices default to Indian Rupees (`₹`).
- **Responsive Mobile Layout**: Dedicated mobile transaction cards (`md:hidden`) with client avatars, transaction titles, status badges, and date tap targets.
- **Payment Timeline**: Aligned vertical timeline axis with centered status badges (`Receipt` & `IndianRupee`).

---

### 🌐 7. Landing Page & Subscription Plans
- **Simple Pricing**:
  - **Monthly Starter**: **₹149 / month**
  - **Pro Annual Pass**: **₹699 / year** (*Save 60% • ~₹58/mo*) with interactive monthly/yearly billing switch.
- **Direct Onboarding**: Landing page CTAs lead directly to `/register` (`Get Started Free`) with simple `"Already have an account? Log In"` link on the registration form.
- **Developer Credit**: Developed & Designed by [LightApps.co](https://lightapps.co/).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Hook Form, Zod.
- **Backend API**: Node.js / Express, MongoDB, JWT Authentication, Axios Interceptors.
- **Styling & Animation**: Custom CSS transitions with `cubic-bezier(0.16, 1, 0.3, 1)` timing curves and responsive CSS Grid/Flexbox layouts.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ravslee/event-manager-app.git
   cd event-manager-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 👨‍💻 Developer & Designer Credit

Designed & Developed with ❤️ by **[LightApps.co](https://lightapps.co/)**.
© 2026 NIVO India. All rights reserved.
