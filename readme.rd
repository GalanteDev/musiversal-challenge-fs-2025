````
# 🎵 **Musiversal Songs Library**

**Fullstack Challenge Project – 2025 edition**

---

![Musiversal Logo](https://github.com/user-attachments/assets/8498da41-cfab-4258-b1db-3378fe8529c2)

---

## 🚀 Overview

This is a **fullstack application** built for the [Musiversal Fullstack Challenge 2025](https://github.com/musiversal/fullstack-challenge-2025/tree/master). It allows users to manage a music library with support for uploading cover images, editing, and deleting songs.

---

## 🌐 Live Version

🔗 **Deployed app (Vercel):**
[Musiversal Songs Library - Live Demo](https://musiversal-challenge-fs-2025.vercel.app)

---

## 🛠️ Technologies Used

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **Multer** (file uploads)
- **Swagger** (API documentation)
- **Jest** (unit testing)

### Frontend

- **React**
- **Vite**
- **Tailwind CSS**

---

## 📦 Installation & Setup

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/musiversal-songs-library.git
cd musiversal-songs-library
```
````

### 2. Install dependencies:

#### Backend:

```bash
cd server
npm install
```

#### Frontend:

```bash
cd ../client
npm install
```

### 3. Run the backend:

```bash
cd server
npm run dev
```

### 4. Run the frontend:

```bash
cd client
npm run dev
```

---

## 🧪 Running Tests

To execute unit tests for the backend, run:

```bash
cd server
npm run test
```

---

## 📘 API Documentation

After starting the backend, Swagger UI is available at:

[Swagger API Documentation](http://localhost:4000/docs)

---

## 🖼️ Protected Images & Auto-Seeding

To enhance the developer experience, the server preloads **3 protected songs** on every startup:

- **Hammer Smashed Face** – _Cannibal Corpse_ (`canibalcorpse.png`)
- **Roots Bloody Roots** – _Sepultura_ (`sepultura.png`)
- **Raining Blood** – _Slayer_ (`slayer.png`)

These cover images are automatically copied from the `static-images/` folder into `uploads/`, **only if they are missing**. If deleted, simply restart the server, and they will be restored (provided the images exist in `static-images/`).

> ⚠️ **Important:** Ensure that the `/server/static-images` folder contains these files when cloning the repo.

---

## 📋 Environment Variables

### Backend (`server/.env`)

```env
PORT=4000
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:4000
```

Make sure to adjust the `VITE_API_URL` when deploying the frontend.

---

## 🤝 Contact & Support

If you have any questions, feedback, or encounter issues, feel free to reach out:

✉️ **Email:** [galante.julian@gmail.com](mailto:galante.julian@gmail.com)

---

Made with ❤️ by **Julian Galante** for Musiversal. Keep creating, keep collaborating!

```

```
