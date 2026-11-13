# 🎬 GifTastic

A fast, responsive, dark-themed GIF search and curation web application powered by the [GIPHY API](https://giphy.com). Users can browse live trending GIFs, create persistent custom topic buttons, preview animations on hover, and save a personal favorites collection across sessions.

---

## ✨ Features

* **Live Search & Trending Feeds:** Fetches real-time search results and trending GIFs asynchronously from GIPHY's REST API with offset-based **Load More** pagination.
* **Hover-to-Play Media Optimization:** Loads lightweight static thumbnails by default that automatically animate on mouse hover and pause on leave, reducing initial page bandwidth.
* **Global Playback & Rating Controls:** Includes a one-click **Play All / Pause All** toggle and a client-side **G / PG Rating Filter** that updates the grid instantly without extra API calls.
* **Persistent Custom Topics:** Add your own search buttons or remove individual tags anytime—all saved automatically via browser `localStorage`.
* **Saved Favorites Collection:** Heart any GIF to store it in a dedicated **Favorites** tab that persists across browser sessions.
* **Full-Screen Lightbox & Quick Share:** Expand any GIF into a keyboard-accessible preview modal (`Esc` to close) with resolution details and one-click clipboard link copying.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (CSS Grid, Flexbox, Custom Properties)
* **Logic & DOM:** JavaScript (ES6+), jQuery 3.3.1
* **API & Storage:** GIPHY REST API (`/search` & `/trending`), Web Storage API (`localStorage`), Clipboard API

---

## 📁 Project Structure

```text
GifTastic/
├── index.html          # Main application markup & lightbox modal
├── assets/
│   ├── css/
│   │   └── style.css   # Custom dark theme, responsive grid & modal styles
│   └── js/
│       └── app.js      # GIPHY API integration, state & localStorage logic
└── README.md
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd giftastic
   ```

2. **Configure your GIPHY API Key:**
   * Create a free app on the [GIPHY Developers Dashboard](https://giphy.comdashboard/) to get an API key.
   * Open `assets/js/app.js` and replace the `APIKey` value at the top of the file:
     ```javascript
     const APIKey = 'YOUR_GIPHY_API_KEY';
     ```

3. **Run the app:**
   * Open `index.html` directly in your browser or serve it with a local development server (such as VS Code **Live Server**).

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
