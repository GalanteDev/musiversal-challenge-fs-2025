<div align="center">
  <img src="./assets/musiversal.png" alt="Musiversal Logo" width="200" />  
  
  <h1>Musiversal Songs Library</h1>
  <p><em>Your ultimate music management toolkit</em></p>
</div>

# Musiversal Songs Library

**Fullstack Challenge 2025**

_This README fulfills the requirements of the [Musiversal Fullstack Challenge 2025](https://github.com/musiversal/fullstack-challenge-2025/tree/master)._

Musiversal Songs Library is a fullstack application (frontend + backend) enabling you to manage a songs library: upload cover images, create, and delete tracks. It includes protected seed data and comprehensive validation on both client and server.

---

## 🌐 Live Demo

- **Frontend App (Vercel):** [Live Demo](https://musiversal-challenge-fs-2025.vercel.app)

---

## 🔧 Technologies

**Backend**

- Node.js
- Express.js
- TypeScript
- Multer (file uploads)
- Swagger (API documentation)
- Jest (unit testing)
- SuperTest (integration testing)

**Frontend**

- React
- Vite
- Tailwind CSS
- React-hook-form
- Zod

---

## ⚙️ Setup & Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/musiversal-challenge-fs-2025.git && cd musiversal-challenge-fs-2025
   ```
2. **Install dependencies**
   - **Backend:**
     ```bash
     cd server && npm install
     ```
   - **Frontend:**
     ```bash
     cd client && npm install
     ```
3. **Run in development**
   - **Backend:**
     ```bash
     cd server && npm run dev
     ```
   - **Frontend:**
     ```bash
     cd client && npm run dev
     ```
     Open `http://localhost:3000` for the frontend.

---

## 🛠️ Environment Variables

The backend has sensible defaults and does not strictly require a `.env` locally. You can configure them by creating a `server/.env` file:

```env
PORT=4000
UPLOAD_DIR=uploads
MAX_IMAGE_SIZE=2097152
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif
```

The frontend **requires** a `.env` in `client/`:

```env
VITE_API_URL=http://localhost:4000
```

---

## 🔒 Validations

All inputs are validated on both the client and the server.

- Try uploading unsupported file types or too large images.
- Try submitting forms with missing fields.
- Errors will display in the UI and return a structured JSON error from the API.

---

## 📂 Postman Collection

Import `assets/song-api.postman_collection.json` into Postman or Insomnia:

1. Click **Import** → **File**, then select `assets/song-api.postman_collection.json`.
2. Make sure the collection’s `API_URL` environment variable points to your server (e.g., `http://localhost:4000`).

---

## 🧪 Running Tests

```bash
cd server && npm test
```

---

## 📘 API Documentation

Swagger UI is available at:

```
http://localhost:4000/docs
```

---

## 🖼️ Protected Tracks & Auto-Seeding

On server startup, three “protected” tracks are automatically seeded from `server/static-images/` into `uploads/` and the in-memory store:

- Hammer Smashed Face (Cannibal Corpse)
- Roots Bloody Roots (Sepultura)
- Raining Blood (Slayer)

This ensures core data is always present and resilient to accidental deletion, **and provides a ready-to-use development experience** for immediate demo and testing.

---

## 🎸 Cheers and rock on!

_— Julian Galante —_
