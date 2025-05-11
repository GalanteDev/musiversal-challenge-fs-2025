# 🎵 Musiversal Songs Library

<p align="center">
  <img src="./assets/musiversal-logo.png" alt="Musiversal Logo" width="200" />
</p>

---

## 🚀 Fullstack Challenge 2025

This repository contains the solution for the **Musiversal Fullstack Challenge 2025**. It’s a fullstack application (frontend + backend) that lets you manage a songs library: upload cover images, create, and delete tracks.

## 🌐 Live Demo

Check out the deployed version on Vercel:

🔗 [Musiversal Songs Library - Live Demo](https://musiversal-challenge-fs-2025.vercel.app)

---

## 🔧 Technologies

### Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **Multer** (file uploads)
* **Swagger** (API documentation)
* **Jest** (unit testing)

### Frontend

* **React**
* **Vite**
* **Tailwind CSS**
* **React-hook-form**
* **Zod**
---

## ⚙️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/musiversal-songs-library.git
   cd musiversal-songs-library
   ```
2. **Install dependencies**

   * Backend:

     ```bash
     cd server
     npm install
     ```
   * Frontend:

     ```bash
     cd ../client
     npm install
     ```
3. **Run in development**

   * Backend:

     ```bash
     cd server
     npm run dev
     ```
   * Frontend:

     ```bash
     cd client
     npm run dev
     ```

   Open your browser at `http://localhost:3000`.

---

## 🧪 Running Tests

To run backend unit tests:

```bash
cd server
npm test
```

---

## 📘 API Documentation

After starting the server, access Swagger UI at:

```
http://localhost:4000/docs
```

---

## 🖼️ Protected Tracks & Auto-Seeding

On each server startup, a seeding routine checks for the presence of three protected tracks. If any are missing in the `server/uploads/` directory, their cover images and metadata are automatically copied from the `server/static-images/` folder.

### Seeded Tracks

| Track               | Artist          | Filename            | Description                                                       |
| ------------------- | --------------- | ------------------- | ----------------------------------------------------------------- |
| Hammer Smashed Face | Cannibal Corpse | `canibalcorpse.png` | A classic death metal anthem (1993).                              |
| Roots Bloody Roots  | Sepultura       | `sepultura.png`     | Genre-defining track blending metal and Brazilian rhythms (1996). |
| Raining Blood       | Slayer          | `slayer.png`        | Thrash metal staple known for its intense riff (1986).            |

### How It Works

1. **Startup Hook**: In `server/index.ts` (or `app.ts`), the seeder module runs before the Express server listens on the port.
2. **File Check**: For each protected track, the code checks if both the JSON entry and the image file exist in `uploads/`.
3. **Copy Logic**: If missing, the module:

   * Reads metadata (title, artist, filename) from a predefined array.
   * Copies the image from `server/static-images/<filename>` to `server/uploads/<filename>`.
   * Inserts the song entry into the database (or in-memory store) with default metadata.
4. **Idempotency**: The routine only adds missing entries, so restarting the server won’t create duplicates.

### Configuration & Customization

* **Static Images**: Ensure the `server/static-images/` folder contains the PNG files listed above.
* **Upload Directory**: By default, `server/uploads/` is where Multer stores user-uploaded images.
* **Adding New Seeds**:

  1. Add a new entry to the `protectedSongs` array in `server/seed.ts`:

     ```ts
     interface SeedTrack {
       title: string;
       artist: string;
       filename: string;
       description?: string;
     }

     export const protectedSongs: SeedTrack[] = [
       // existing entries...
       {
         title: 'New Track',
         artist: 'New Artist',
         filename: 'newtrack.png',
         description: 'Your description here',
       },
     ];
     ```
  2. Place `newtrack.png` in `server/static-images/`.
  3. Restart the server to seed the new track.

> ⚠️ **Important:** If you remove a seeded image or entry from `uploads/`, simply restart the server to restore it. Always keep `static-images/` in sync with your seed definitions.

\-----------------------|------------------|-------------------------|
\| Hammer Smashed Face   | Cannibal Corpse  | `canibalcorpse.png`     |
\| Roots Bloody Roots    | Sepultura        | `sepultura.png`         |
\| Raining Blood         | Slayer           | `slayer.png`            |

> **Note:** Make sure the `server/static-images` folder contains these files. If you delete them from `uploads`, simply restart the server to restore.

---

## 🛠️ Environment Variables

### Backend (`server/.env`)

```env
PORT=4000
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:4000
```

Adjust `VITE_API_URL` before deploying.

---
