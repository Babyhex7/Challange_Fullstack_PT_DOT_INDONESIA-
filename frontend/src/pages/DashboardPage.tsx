// Dashboard Page - ringkasan data (modern rounded UI)
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FolderTree,
  Package,
  Users,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import Header from "../components/layout/Header";
import { categoriesService } from "../services/categories.service";
import { productsService } from "../services/products.service";

interface Stats {
  totalCategories: number;
  totalProducts: number;
}

interface PrevStats {
  totalCategories: number;
  totalProducts: number;
  adminUsers: number;
  timestamp: number;
}

// Hitung persentase perubahan
function calcChange(
  current: number,
  previous: number,
): { pct: number; label: string } {
  if (previous === 0 && current === 0) return { pct: 0, label: "0%" };
  if (previous === 0) return { pct: 100, label: "+100%" };
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct > 0) return { pct, label: `+${pct}%` };
  if (pct < 0) return { pct, label: `${pct}%` };
  return { pct: 0, label: "0%" };
}

const STATS_KEY = "dashboard_prev_stats";

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalCategories: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<{
    categories: { pct: number; label: string };
    products: { pct: number; label: string };
    admin: { pct: number; label: string };
  }>({
    categories: { pct: 0, label: "—" },
    products: { pct: 0, label: "—" },
    admin: { pct: 0, label: "—" },
  });
  const statsUpdated = useRef(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catData, prodData] = await Promise.all([
          categoriesService.getAll({ page: 1, limit: 1 }),
          productsService.getAll({ page: 1, limit: 1 }),
        ]);
        const currentCats = catData.meta.totalItems;
        const currentProds = prodData.meta.totalItems;
        const currentAdmin = 1;

        setStats({
          totalCategories: currentCats,
          totalProducts: currentProds,
        });

        // Hitung perubahan dari data sebelumnya (localStorage)
        if (!statsUpdated.current) {
          statsUpdated.current = true;
          const stored = localStorage.getItem(STATS_KEY);
          if (stored) {
            try {
              const prev: PrevStats = JSON.parse(stored);
              setChanges({
                categories: calcChange(currentCats, prev.totalCategories),
                products: calcChange(currentProds, prev.totalProducts),
                admin: calcChange(currentAdmin, prev.adminUsers),
              });
            } catch {
              // Data rusak, reset
            }
          } else {
            // Pertama kali, tampilkan sebagai "New"
            setChanges({
              categories: { pct: 0, label: "Baru" },
              products: { pct: 0, label: "Baru" },
              admin: { pct: 0, label: "Baru" },
            });
          }

          // Simpan stats saat ini untuk perbandingan berikutnya
          const newPrev: PrevStats = {
            totalCategories: currentCats,
            totalProducts: currentProds,
            adminUsers: currentAdmin,
            timestamp: Date.now(),
          };
          localStorage.setItem(STATS_KEY, JSON.stringify(newPrev));
        }
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
      shadowColor: "shadow-blue-500/20",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      change: changes.categories,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-emerald-500 to-emerald-600",
      shadowColor: "shadow-emerald-500/20",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      change: changes.products,
    },
    {
      title: "Admin Users",
      value: 1,
      icon: Users,
      gradient: "from-violet-500 to-violet-600",
      shadowColor: "shadow-violet-500/20",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
      change: changes.admin,
    },
    {
      title: "API Status",
      value: "Active",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-500",
      shadowColor: "shadow-amber-500/20",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      change: { pct: 0, label: "Online" },
    },
  ];

  // Warna badge berdasarkan perubahan
  const getBadgeStyle = (change: { pct: number; label: string }) => {
    if (change.label === "Baru" || change.label === "Online") {
      return "bg-blue-50 text-blue-600";
    }
    if (change.pct > 0) return "bg-emerald-50 text-emerald-600";
    if (change.pct < 0) return "bg-red-50 text-red-500";
    return "bg-gray-100 text-gray-500";
  };

  const getBadgeIcon = (change: { pct: number; label: string }) => {
    if (change.label === "Baru" || change.label === "Online") return null;
    if (change.pct > 0) return <ArrowUpRight size={12} />;
    if (change.pct < 0) return <ArrowDownRight size={12} />;
    return <Minus size={12} />;
  };

  return (
    <>
      <Header title="Dashboard" subtitle="Overview dan ringkasan data" />
      <div className="p-8">
        {/* Grid kartu statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`bg-linear-to-br ${card.gradient} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${card.shadowColor}`}
                >
                  <card.icon size={22} className="text-white" />
                </div>
                <div
                  className={`${getBadgeStyle(card.change)} text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1`}
                >
                  {getBadgeIcon(card.change)}
                  {card.change.label}
                </div>
              </div>
              <p className="text-[13px] text-gray-500 font-medium">
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
          <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-7 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Selamat Datang di Admin Panel
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-2xl hover:bg-gray-100 transition-all border border-gray-200/60"
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
