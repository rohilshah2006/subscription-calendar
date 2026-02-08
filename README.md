# 🪐 Subscription Calendar

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

This project avoids heavy UI libraries in favor of custom implementation for maximum performance and control.

* **Core:** React 18
* **Styling:** Tailwind CSS + Custom Keyframe Animations
* **State Management:** React Hooks (`useState`, `useRef`, `useEffect`)
* **Data Persistence:** Asynchronous File Storage (JSON)
* **Icons:** Lucide React + Emoji/Text fallback engine

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
    git clone [https://github.com/rohilshah2006/subscription-calendar.git](https://github.com/rohilshah2006/subscription-calendar.git)
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

## 👤 Author

**Rohil Shah**
* *Concept, Design, and Core Logic*

---

*Built with ❤️ and a lot of `Math.PI`.*