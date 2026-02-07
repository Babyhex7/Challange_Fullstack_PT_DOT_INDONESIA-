// Category Detail Page - tampilkan detail category beserta daftar products-nya
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FolderTree,
  Package,
  Calendar,
  Search,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";
import { categoriesService } from "../services/categories.service";
import { productsService } from "../services/products.service";
import type { Category } from "../types/category.types";
import type { Product } from "../types/product.types";
import type { PaginationMeta } from "../types/api.types";
import Pagination from "../components/ui/Pagination";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    totalItems: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [prodLoading, setProdLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Ambil detail category
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await categoriesService.getById(Number(id));
        setCategory(data);
      } catch {
        setError("Category tidak ditemukan");
        toast.error("Gagal memuat detail category");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  // Ambil products milik category ini
  const fetchProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const data = await productsService.getAll({
        page,
        limit: 10,
        categoryId: Number(id),
        search: search || undefined,
      });
      setProducts(data.items);
      setMeta(data.meta);
    } catch {
      toast.error("Gagal memuat products");
    } finally {
      setProdLoading(false);
    }
  }, [id, page, search]);

  useEffect(() => {
    if (id) fetchProducts();
  }, [fetchProducts, id]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Format harga ke rupiah
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // Format tanggal
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <>
        <Header title="Detail Category" subtitle="Memuat data..." />
        <div className="p-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="animate-pulse space-y-4">
              <div className="skeleton w-48 h-6" />
              <div className="skeleton w-96 h-4" />
              <div className="skeleton w-32 h-4" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <Header title="Detail Category" subtitle="Data tidak ditemukan" />
        <div className="p-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Category Tidak Ditemukan
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {error || "Data yang Anda cari tidak tersedia."}
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-2xl hover:bg-gray-200 transition-all"
            >
              <ArrowLeft size={16} />
              Kembali ke Categories
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Detail Category"
        subtitle={`Informasi lengkap category "${category.name}"`}
      />
      <div className="p-8">
        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/categories")}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar category
        </button>

        {/* Info Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-6 shadow-sm">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <FolderTree size={24} className="text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                {category.description || "Tidak ada deskripsi"}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Package size={14} />
                  <span>
                    <strong className="text-gray-600">{meta.totalItems}</strong>{" "}
                    products
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Dibuat: {formatDate(category.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Diperbarui: {formatDate(category.updatedAt)}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    category.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {category.isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Products dalam category ini */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-7 py-5 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h4 className="text-base font-bold text-gray-900">
              Products di Category Ini
            </h4>
            <div className="relative w-full sm:w-72">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <input
                type="text"
                placeholder="Cari product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-2xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider w-12">
                  #
                </th>
                <th className="text-left py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                  Nama Product
                </th>
                <th className="text-right py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                  Harga
                </th>
                <th className="text-center py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                  Stock
                </th>
                <th className="text-left py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider hidden lg:table-cell">
                  Deskripsi
                </th>
                <th className="text-center py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider w-28">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {prodLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4 px-5">
                      <div className="skeleton w-6 h-4" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-32 h-4" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-24 h-4 ml-auto" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-10 h-4 mx-auto" />
                    </td>
                    <td className="py-4 px-5 hidden lg:table-cell">
                      <div className="skeleton w-48 h-4" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-16 h-4 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Package size={40} className="mx-auto mb-3 text-gray-200" />
                    <p className="font-medium text-gray-400">
                      Tidak ada product
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                      Belum ada product di category ini
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((prod, idx) => (
                  <tr
                    key={prod.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-5 text-gray-300 text-xs font-medium">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="py-4 px-5 font-semibold text-gray-800">
                      {prod.name}
                    </td>
                    <td className="py-4 px-5 text-right font-semibold text-emerald-600">
                      {formatPrice(prod.price)}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-400 truncate max-w-xs hidden lg:table-cell">
                      {prod.description || (
                        <span className="text-gray-200">-</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <Link
                        to={`/products/${prod.id}`}
                        className="text-blue-500 hover:text-blue-700 text-xs font-semibold hover:underline"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="px-7 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Total:{" "}
                <span className="font-semibold text-gray-600">
                  {meta.totalItems}
                </span>{" "}
                products
              </p>
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
