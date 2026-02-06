// Login Page - split layout: kiri ilustrasi, kanan form login
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  BarChart3,
  Package,
  ArrowRight,
} from "lucide-react";
import { getErrorMessage } from "../utils/error";

// Schema validasi login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(6, "Password minimal 6 karakter"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast.success("Login berhasil!");
      navigate("/");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login gagal!"));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ========== KIRI - Ilustrasi / Branding ========== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden items-center justify-center p-12 rounded-tr-3xl rounded-br-3xl">
        {/* Decorative elements */}
        <div className="absolute top-[-15%] left-[-10%] w-125 h-125 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] w-100 h-100 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/5 rounded-full blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-lg animate-fadeIn">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-blue-300/60 text-sm">
                Product Management System
              </p>
            </div>
          </div>

          {/* Headline */}
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
            Kelola semua
            <br />
            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              produk & kategori
            </span>
            <br />
            dalam satu dashboard.
          </h2>

          <p className="text-blue-200/50 text-base leading-relaxed mb-10 max-w-md">
            Pantau performa, atur stok, dan kelola data bisnis Anda dengan
            antarmuka modern yang intuitif.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: ShieldCheck, label: "Keamanan JWT" },
              { icon: BarChart3, label: "Analitik Real-time" },
              { icon: Package, label: "CRUD Lengkap" },
            ].map((feat) => (
              <div
                key={feat.label}
                className="flex items-center gap-2.5 bg-white/6 backdrop-blur-sm border border-white/8 rounded-2xl px-4 py-2.5"
              >
                <feat.icon size={16} className="text-blue-400" />
                <span className="text-sm text-blue-100/80 font-medium">
                  {feat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== KANAN - Form Login ========== */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-10 bg-gray-50/80">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Mobile logo - hanya tampil di mobile */}
          <div className="lg:hidden mb-10">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-400">Product Management</p>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Selamat datang!
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Masukkan kredensial untuk mengakses dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="admin@example.com"
                className={`w-full px-4 py-3.5 rounded-2xl border-2 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 bg-red-50/50"
                    : "border-gray-200 focus:border-blue-400 bg-white"
                } focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-sm placeholder:text-gray-300`}
                autoFocus
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3.5 rounded-2xl border-2 ${
                    errors.password
                      ? "border-red-300 focus:border-red-400 bg-red-50/50"
                      : "border-gray-200 focus:border-blue-400 bg-white"
                  } focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200 text-sm pr-12 placeholder:text-gray-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <p className="font-semibold text-gray-700 text-sm mb-2">
              🔑 Demo Credentials
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email</span>
                <code className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-mono text-gray-600 border border-gray-100">
                  admin@example.com
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Password</span>
                <code className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-mono text-gray-600 border border-gray-100">
                  password123
                </code>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-300 mt-8">
            &copy; 2026 Admin Panel. Built with React & NestJS.
          </p>
        </div>
      </div>
    </div>
  );
}
