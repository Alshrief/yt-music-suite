# yt-music-suite

A local YouTube Music player I built for my own use. I was annoyed that I couldn't easily save songs from YouTube Music at full quality and play them offline in a clean interface, so I just built the whole thing myself.

It's two parts: a Node.js server that downloads and serves audio files, and a Chrome extension that adds a download button directly inside YouTube and YouTube Music pages.

---

## What it does

**Chrome Extension:**
- Adds a download button right next to the like/share buttons on YouTube and YouTube Music
- Shows real-time download progress on the button itself
- Detects if a song is already in your library so you don't download it twice

**Local Server:**
- Downloads audio at 320kbps MP3 with 48kHz sample rate using yt-dlp + ffmpeg
- Tags every file with the correct title, artist, album, and cover art (ID3 tags)
- Applies loudness normalization and a subtle EQ so everything sounds good at the same volume
- Serves files over HTTP with Range Request support, works on your phone over local network too
- Watches the music folder and updates the library instantly when new files are added

**Web App:**
- A full Arabic RTL dark-mode music player that runs at `localhost:3000`
- Has a real sidebar with Home, Explore, Library, Downloads, and Favorites views
- Web Audio API equalizer with Bass Boost toggle
- MediaSession API integration so media keys and lock screen controls work
- Pop-out mini player window
- Fully responsive, works on mobile

---

## Requirements

- Node.js 16+
- Google Chrome

---

## Setup

**1. Start the server**

```bash
cd server
npm install
npm start
```

You should see:
```
🚀 Server running at http://localhost:3000
⚡ Extension endpoint listening at http://localhost:4000
```

**2. Install the Chrome extension**

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Open any YouTube or YouTube Music page and the download button will appear

**3. Open the player**

```
http://localhost:3000
```

Works from your phone too if it's on the same network.

---

## Stack

- **Backend:** Node.js, Express, yt-dlp-exec, fluent-ffmpeg, ffmpeg-static, music-metadata, node-id3
- **Frontend:** Vanilla JS (ES6+), HTML5, CSS3, Web Audio API
- **Extension:** Chrome Manifest V3, Content Scripts

---

## Notes

- Downloaded audio files are git-ignored. The `server/music/` folder is in `.gitignore` so nothing gets pushed to the repo.
- Concurrent downloads are supported. You can queue multiple songs and they'll all download in the background.
- The server runs on two ports: `3000` for the web app and `4000` for the extension endpoint (so the extension can communicate with it regardless of what tab you're on).

---

## Author

**alshrief** — [ahmed.r.elshrief@gmail.com](mailto:ahmed.r.elshrief@gmail.com)

---

## License

MIT
