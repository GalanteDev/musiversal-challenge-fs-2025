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
- Prisma ORM
- PostgreSQL (Neon.tech)
- Supabase Storage (image hosting)
- Jest & SuperTest (testing)

**Frontend**

- React
- Vite
- Tailwind CSS
- React Hook Form
- Zod (validation)
- React Query

---

## ⚙️ Setup & Installation (Local Development)

1. Clone the repo:

```bash
git clone https://github.com/GalanteDev/musiversal-challenge-fs-2025.git
cd musiversal-challenge-fs-2025
```

2. Start PostgreSQL locally with Docker Compose:

```bash
docker-compose up -d
```

This will start a Postgres container with:

- User: `musicuser`
- Password: `musicpass`
- Database: `musicapp`

3. Install dependencies:

- Backend:

```bash
cd server
npm install
```

- Frontend:

```bash
cd ../client
npm install
```

4. Configure environment variables:

- Backend: Create `server/.env` with:

```
DATABASE_URL=postgresql://musicuser:musicpass@localhost:5432/musicapp
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_BUCKET=songs
JWT_SECRET=your_jwt_secret
DEMO_PASSWORD=your_demo_password
```

- Frontend: Create `client/.env` with:

```
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
```

5. Run backend and frontend in development mode:

```bash
# Backend
cd ../server
npm run dev

# Frontend (in a separate terminal)
cd ../client
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🚀 Production

- Backend is hosted on [Railway.app](https://railway.app) connected to:

  - PostgreSQL DB hosted on Neon.tech
  - Supabase storage bucket for images

- Frontend is deployed on Vercel ([Live Demo](https://musiversal-challenge-fs-2025.vercel.app)).

---

## 🧪 Testing

Run tests locally:

```bash
cd server
npm test
```

---

## 🖼️ Seed Data

On server startup, seed scripts add protected demo songs with images uploaded to Supabase storage to ensure demo users have initial data.

---

## 🔒 Validation & Error Handling

- Client and server input validation with Zod.
- Graceful error messages displayed in UI and API responses.

---

## 📘 API Documentation

Swagger UI available at:

```
http://localhost:4000/docs
```

---

## 📜 Summary

This project demonstrates a robust fullstack app with modern tooling, covering backend REST API, image uploads, auth, validation, testing, and deployment.

---

## 👋 Cheers and rock on!

_— Julian Galante —_
