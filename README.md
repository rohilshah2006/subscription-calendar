# 📅 Subscription Calendar

**A high-fidelity, visualization-first subscription tracker built with React.**

Subscription Calendar transforms boring financial lists into a fluid, interactive calendar and radial visualization system. It moves beyond standard tables, using custom coordinate math to render spending habits as a living solar system of data.

---

## ✨ Key Features

### 1. The "Orbit" Visualization ⭕
At the click of a button, the interface warps from a calendar grid into a **Radial Spending Chart**.
* **Math-Based Rendering:** Uses trigonometry (`Math.cos`, `Math.sin`) to calculate precise screen coordinates for every icon based on spending weight.
* **Dynamic Gradients:** Generates SVG gradients on the fly matching the brand colors of your subscriptions.
* **Zero-Library Animations:** No chart libraries. The "Orbit" is built from scratch using SVG paths and calculated arcs.

### 2. Fluid Calendar Engine 📅
* **Seamless Transitions:** Custom CSS keyframes (`slideOutLeft`, `flipUp`) handle smooth switching between Monthly and Yearly views.
* **Conflict Resolution:** Smart UI handles "Traffic Jams" (multiple subscriptions on the same day) with a sleek primary-selector modal.
* **Time Travel:** Rapidly navigate through years and months with gesture-based animations.

### 3. Smart Interaction 🖱️
* **Cursorless UI:** The app hides the system cursor and renders a custom React-based follower for deeper immersion.
* **Context-Aware Tooltips:** Hovering over dates calculates screen position to prevent overflow and stacks multiple subscriptions intelligently.
* **Persisted State:** Uses a custom IPC bridge (`window.storage`) to save your data instantly to the local file system.

---

## 🛠️ Under the Hood

### Tech Stack

<div align="left">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <br>
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br>

This project avoids heavy UI libraries in favor of custom implementation for maximum performance and control.

* **Frontend:** React 19, TypeScript
* **Styling:** Tailwind CSS + Custom CSS Keyframe Animations
* **Build Tool:** Vite
* **State Management:** React Hooks (`useState`, `useRef`, `useEffect`)
* **Data Persistence:** Asynchronous File Storage via `window.storage` IPC bridge (JSON)
* **Icons:** Emoji / Text / SVG fallback engine (zero icon libraries)

### The "Math" Bit
The radial menu isn't a pre-made component. It calculates the arc length for every subscription based on its cost relative to the total:
```javascript
// Example logic from the engine
const segmentAngle = (amount / totalAmount) * 360;
const x = radius * Math.cos(angle);
const y = radius * Math.sin(angle);
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js installed
* npm or yarn

### Installation
1.  Clone the repo:
    ```bash
    git clone https://github.com/rohilshah2006/subscription-calendar.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm start
    ```

---

## 🎨 Customization

You can easily add new icons or currency types in the `App.tsx` file. The app currently supports a hybrid input system allowing for:
* **Emojis:** 🎵, 📺, 🎮
* **Text:** "N" (Netflix), "Sp" (Spotify)
* **Preset SVGs:** Built-in brand logos.

---

## 📋 Changelog

### v1.1.0 — March 2, 2026
* **Edit Subscriptions panel** — Clicking "Edit Subscriptions" in the Manage panel now opens a full management UI.
  * Inline edit form for every subscription (name, amount, day, icon, color, start date)
  * Delete with confirmation dialog
  * Toast notifications for saves and deletions
  * Changes persist to local storage

### v1.0.0 — February 8, 2026
* Initial release
* Radial "Orbit" spending visualization
* Monthly and yearly calendar views with smooth transitions
* Subscription conflict resolution (multiple subs on same day)
* Custom cursor, context-aware tooltips, and persisted state
* Add new subscription form

---

## 👤 Author

**Rohil Shah**
* *Concept, Design, and Core Logic*

---

*Built with ❤️ and a lot of `Math.PI`.*