<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #333; background: #f9f9f9; padding: 20px;">

<!-- Banner -->
<div style="background-color: #FFDD00; padding: 40px 20px; border-radius: 8px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <img src="./assets/musiversal.png" alt="Musiversal Logo" width="200" style="display: block; margin: 0 auto 20px;" />
  <h1 style="margin: 0; font-size: 2.5em; color: #1a1a1a;">Musiversal Songs Library</h1>
</div>

<div style="margin-top: 30px;">
  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">🚀 Fullstack Challenge 2025</h2>
    <p style="font-size: 1.1em; line-height: 1.6;">This repository contains the solution for the <strong>Musiversal Fullstack Challenge 2025</strong>. It’s a fullstack application (frontend + backend) that lets you manage a songs library: upload cover images, create, edit, and delete tracks.</p>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">🌐 Live Demo</h2>
    <p style="font-size: 1.1em; line-height: 1.6;">Check out the applications deployed on Vercel and your chosen backend host:</p>
    <ul style="line-height: 1.6;">
      <li><strong>Frontend App (Vercel):</strong> 🔗 <a href="https://musiversal-challenge-fs-2025.vercel.app" style="color: #0055ff; text-decoration: none;">Live Demo</a></li>
    </ul>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">🔧 Technologies</h2>
    <div style="display: flex; gap: 40px;">
      <div>
        <h3 style="margin-bottom: 10px;">Backend</h3>
        <ul style="line-height: 1.6;">
          <li>Node.js</li>
          <li>Express.js</li>
          <li>TypeScript</li>
          <li>Multer (file uploads)</li>
          <li>Swagger (API documentation)</li>
          <li>Jest (unit testing)</li>
        </ul>
      </div>
      <div>
        <h3 style="margin-bottom: 10px;">Frontend</h3>
        <ul style="line-height: 1.6;">
          <li>React</li>
          <li>Vite</li>
          <li>Tailwind CSS</li>
          <li>React-hook-form</li>
          <li>Zod</li>
        </ul>
      </div>
    </div>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">⚙️ Setup & Installation</h2>
    <ol style="line-height: 1.6;">
      <li><strong>Clone the repo</strong>: <code>git clone https://github.com/your-username/musiversal-challenge-fs-2025.git && cd musiversal-challenge-fs-2025</code></li>
      <li><strong>Install dependencies</strong>:
        <ul>
          <li>Backend: <code>cd server && npm install</code></li>
          <li>Frontend: <code>cd ../client && npm install</code></li>
        </ul>
      </li>
      <li><strong>Run in development</strong>:
        <ul>
          <li>Backend: <code>cd server && npm run dev</code></li>
          <li>Frontend: <code>cd client && npm run dev</code></li>
        </ul>
        Open <code>http://localhost:3000</code>
      </li>
    </ol>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">🧪 Running Tests</h2>
    <p style="font-size: 1.1em; line-height: 1.6;"><code>cd server && npm test</code></p>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">📘 API Documentation</h2>
    <p style="font-size: 1.1em; line-height: 1.6;"><code>http://localhost:4000/docs</code></p>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
    <h2 style="margin-top: 0; color: #FFAA00;">🖼️ Protected Tracks & Auto-Seeding</h2>
    <p style="font-size: 1.1em; line-height: 1.6;">
      The auto-seeding feature ensures that three predefined "protected" tracks are always available in the application. On server startup, a seeder routine checks if these tracks exist in the <code>server/uploads/</code> directory (both metadata entry and cover image). If any are missing, it automatically restores them from the <code>server/static-images/</code> folder.
    </p>
    <p style="font-size: 1.1em; line-height: 1.6;">
      This mechanism provides:
      <ul style="line-height: 1.6;">
        <li><strong>Consistency:</strong> Guaranteed presence of core tracks on every run.</li>
        <li><strong>Resilience:</strong> Accidental deletions are automatically corrected on restart.</li>
        <li><strong>Extensibility:</strong> New seed tracks can be added by updating the seed definitions and placing images in <code>static-images/</code>.</li>
      </ul>
    </p>
  </section>

  <section style="background: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-top: 20px;">
    <h2 style="margin-top: 0; color: #FFAA00;">🛠️ Environment Variables</h2>
    <p style="font-size: 1.1em; line-height: 1.6;"><strong>Backend</strong> (<code>server/.env</code>): <code>PORT=</code></p>
    <p style="font-size: 1.1em; line-height: 1.6;"><strong>Frontend</strong> (<code>client/.env</code>): <code>VITE_API_URL=http://localhost:4000</code></p>
  </section>
</div>
