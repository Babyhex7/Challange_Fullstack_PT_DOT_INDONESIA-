// Dashboard Page - ringkasan data (modern rounded UI)
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderTree,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  Bot,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import Header from "../components/layout/Header";
import { categoriesService } from "../services/categories.service";
import { productsService } from "../services/products.service";
import { useAuthStore } from "../store/authStore";

interface Stats {
  totalCategories: number;
  totalProducts: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalCategories: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          categoriesService.getAll({ page: 1, limit: 1 }),
          productsService.getAll({ page: 1, limit: 1 }),
        ]);
        setStats({
          totalCategories: catData.meta.totalItems,
          totalProducts: prodData.meta.totalItems,
        });
      } catch {
        // Error ditangani interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: FolderTree,
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Admin Users",
      value: 1,
      icon: Users,
      gradient: "from-violet-500 to-violet-600",
      shadow: "shadow-violet-500/20",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      title: "API Status",
      value: "Active",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
    },
  ];

  return (
    <>
      <Header title="Dashboard" subtitle="Overview dan ringkasan data" />
      <div className="p-8">
        {/* Grid kartu statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`bg-linear-to-br ${card.gradient} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${card.shadow}`}
                >
                  <card.icon size={22} className="text-white" />
                </div>
                <div
                  className={`${card.bgLight} ${card.textColor} text-[11px] font-semibold px-3 py-1 rounded-full`}
                >
                  +0%
                </div>
              </div>
              <p className="text-[13px] text-gray-400 font-medium">
                {card.title}
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
                {loading ? (
                  <span className="skeleton inline-block w-16 h-8" />
                ) : (
                  card.value
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Selamat Datang di Admin Panel
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kelola categories dan products melalui sidebar navigasi di sebelah
              kiri. Gunakan fitur pencarian dan pagination untuk memudahkan
              pengelolaan data.
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Kelola Categories
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                Kelola Products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
