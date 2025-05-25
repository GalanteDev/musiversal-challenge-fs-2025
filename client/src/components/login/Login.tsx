import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as apiLogin } from "@/api/authService";
import { useAuth } from "@/context/AuthContext";
import Spinner from "../ui/Spinner";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function FormError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1 text-red-500 text-xs transition-opacity duration-300"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
}

export default function Login() {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const { token, user } = await apiLogin(data.email, data.password);
      if (!user?.email) {
        setError("email", { message: "User data is missing or invalid" });
        return;
      }
      login(token, user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message =
        err?.response?.data?.errors?.join(" ") ||
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      setError("root", { message });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-start justify-center px-4 pt-32">
      <div className="w-full max-w-md">
        <div className="bg-[#1f1f1f] p-8 rounded border border-[#333333]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
            aria-describedby="form-error"
          >
            {/* Global error */}
            {errors.root?.message && (
              <div
                id="form-error"
                className="mb-4 text-red-600 bg-red-100 border border-red-400 p-3 rounded"
                role="alert"
                aria-live="assertive"
              >
                {errors.root.message}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={() => clearErrors("email")}
                className={`w-full bg-[#252525] border rounded p-4 text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]"
                }`}
                disabled={isSubmitting}
              />
              <FormError message={errors.email?.message} id="email-error" />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                onChange={() => clearErrors("password")}
                className={`w-full bg-[#252525] border rounded p-4 text-white placeholder-gray-400 focus:outline-none transition-colors duration-300 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-[#333333] focus:border-[#FFCC00] focus:ring-[#FFCC00]"
                }`}
                disabled={isSubmitting}
              />
              <FormError
                message={errors.password?.message}
                id="password-error"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-4 rounded-md font-medium flex items-center justify-center gap-4 transition-all duration-300 ${
                isSubmitting
                  ? "bg-[#333333] text-gray-400 cursor-not-allowed"
                  : "bg-[#FFCC00] text-black hover:bg-[#FFD700]"
              }`}
            >
              {isSubmitting ? "Signing in..." : "Log In"}
              {isSubmitting && <Spinner size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
