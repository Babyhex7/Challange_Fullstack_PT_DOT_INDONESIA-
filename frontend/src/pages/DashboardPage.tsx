// Dashboard Page - ringkasan data (total categories, products, user)
import { useEffect, useState } from "react";
import { FolderTree, Package, Users, TrendingUp } from "lucide-react";
import Header from "../components/layout/Header";
import { categoriesService } from "../services/categories.service";
import { productsService } from "../services/products.service";

// Tipe data statistik
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

  // Ambil data statistik dari API
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

  // Data kartu statistik
  const cards = [
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: FolderTree,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-green-500",
      bgLight: "bg-green-50",
    },
    {
      title: "Admin Users",
      value: 1,
      icon: Users,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
    },
    {
      title: "API Status",
      value: "Active",
      icon: TrendingUp,
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-8">
        {/* Grid kartu statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`${card.bgLight} rounded-xl p-6 border border-gray-100`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                >
                  <card.icon size={24} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {loading ? "..." : card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Info section */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Selamat Datang di Admin Panel
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Kelola categories dan products melalui sidebar navigasi di sebelah
            kiri. Gunakan fitur pencarian dan pagination untuk memudahkan
            pengelolaan data.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="/categories"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            >
              Kelola Categories
            </a>
            <a
              href="/products"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
            >
              Kelola Products
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
