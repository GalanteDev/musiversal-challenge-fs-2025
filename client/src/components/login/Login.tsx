import { useState } from "react";
import { login as apiLogin } from "@/api/authService";
import { useAuth } from "@/context/AuthContext"; // Importa el hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { token, user } = await apiLogin(email, password);
      login(token, user); // Aquí actualizas estado global y guardas localStorage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-yellow-400 py-2 rounded font-bold hover:bg-yellow-500"
      >
        Log In
      </button>
    </form>
  );
}
