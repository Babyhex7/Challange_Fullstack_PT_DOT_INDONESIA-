// Product Detail Page - tampilkan detail product lengkap dengan info category
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  FolderTree,
  Calendar,
  DollarSign,
  Box,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";
import { productsService } from "../services/products.service";
import type { Product } from "../types/product.types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsService.getById(Number(id));
        setProduct(data);
      } catch {
        setError("Product tidak ditemukan");
        toast.error("Gagal memuat detail product");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

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
        <Header title="Detail Product" subtitle="Memuat data..." />
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

  if (error || !product) {
    return (
      <>
        <Header title="Detail Product" subtitle="Data tidak ditemukan" />
        <div className="p-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-300" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Product Tidak Ditemukan
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {error || "Data yang Anda cari tidak tersedia."}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-2xl hover:bg-gray-200 transition-all"
            >
              <ArrowLeft size={16} />
              Kembali ke Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Detail Product"
        subtitle={`Informasi lengkap product "${product.name}"`}
      />
      <div className="p-8">
        {/* Tombol kembali */}
        <button
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke daftar product
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info Utama Product */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                <Package size={24} className="text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h3>
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {product.isActive ? (
                      <CheckCircle size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Category badge */}
                {product.category && (
                  <Link
                    to={`/categories/${product.category.id}`}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors mt-1"
                  >
                    <FolderTree size={12} />
                    {product.category.name}
                  </Link>
                )}

                {/* Deskripsi */}
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">
                    Deskripsi
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {product.description ||
                      "Tidak ada deskripsi untuk product ini."}
                  </p>
                </div>

                {/* Timestamps */}
                <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Dibuat: {formatDate(product.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Diperbarui: {formatDate(product.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Harga & Stock */}
          <div className="space-y-5">
            {/* Card Harga */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <DollarSign size={18} className="text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Harga</p>
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 tracking-tight">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Card Stock */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Box size={18} className="text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-gray-400">Stock</p>
              </div>
              <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {product.stock}
                <span className="text-sm font-medium text-gray-400 ml-1">
                  unit
                </span>
              </p>
              {product.stock === 0 && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  Stock habis
                </p>
              )}
            </div>

            {/* Card Category */}
            {product.category && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <FolderTree size={18} className="text-indigo-500" />
                  </div>
                  <p className="text-sm font-semibold text-gray-400">
                    Category
                  </p>
                </div>
                <p className="text-base font-bold text-gray-900">
                  {product.category.name}
                </p>
                <Link
                  to={`/categories/${product.category.id}`}
                  className="text-blue-500 hover:text-blue-700 text-xs font-semibold hover:underline mt-2 inline-block"
                >
                  Lihat semua product di category ini →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
