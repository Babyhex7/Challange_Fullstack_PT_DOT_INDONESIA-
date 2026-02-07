// Categories Page - CRUD categories (tabel, search, pagination, modal form, hapus)
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Plus, Pencil, Trash2, X, FolderTree, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";
import Pagination from "../components/ui/Pagination";
import DeleteModal from "../components/ui/DeleteModal";
import { categoriesService } from "../services/categories.service";
import type { Category } from "../types/category.types";
import type { PaginationMeta } from "../types/api.types";
import { getErrorMessage } from "../utils/error";

// Schema validasi category
const categorySchema = z.object({
  name: z.string().min(1, "Nama category wajib diisi"),
  description: z.string().optional(),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const navigate = useNavigate();

  // State data & loading
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    totalItems: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);

  // State filter
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // State form modal
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  // State hapus
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Ambil data categories dari API
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoriesService.getAll({
        page,
        limit: 10,
        search: search || undefined,
      });
      setCategories(data.items);
      setMeta(data.meta);
    } catch {
      toast.error("Gagal memuat categories");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce search - reset ke page 1 saat search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Buka form buat tambah
  const openAdd = () => {
    setEditId(null);
    reset({ name: "", description: "" });
    setShowForm(true);
  };

  // Buka form buat edit
  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    reset({ name: cat.name, description: cat.description || "" });
    setShowForm(true);
  };

  // Simpan form (create / update)
  const onSave = async (data: CategoryForm) => {
    setSaving(true);
    try {
      if (editId) {
        await categoriesService.update(editId, data);
        toast.success("Category berhasil diupdate");
      } else {
        await categoriesService.create(data);
        toast.success("Category berhasil ditambah");
      }
      setShowForm(false);
      fetchData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Gagal menyimpan"));
    } finally {
      setSaving(false);
    }
  };

  // Hapus category
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await categoriesService.delete(deleteId);
      toast.success("Category berhasil dihapus");
      setDeleteId(null);
      fetchData();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Gagal menghapus"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Header title="Categories" subtitle="Kelola data kategori produk" />
      <div className="p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              type="text"
              placeholder="Cari category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border-2 border-gray-100 bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all placeholder:text-gray-300"
            />
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 shrink-0 active:scale-[0.98]"
          >
            <Plus size={18} />
            Tambah Category
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider w-12">
                  #
                </th>
                <th className="text-left py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                  Nama
                </th>
                <th className="text-left py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="text-center py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider w-28">
                  Products
                </th>
                <th className="text-center py-4 px-5 font-semibold text-gray-400 text-xs uppercase tracking-wider w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-4 px-5">
                      <div className="skeleton w-6 h-4" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-32 h-4" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-48 h-4" />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="skeleton w-10 h-5 mx-auto rounded-full" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="skeleton w-16 h-4 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="text-gray-300">
                      <FolderTree
                        size={48}
                        className="mx-auto mb-3 text-gray-200"
                      />
                      <p className="font-medium text-gray-400">
                        Tidak ada data
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        Tambahkan category pertama
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4 px-5 text-gray-300 text-xs font-medium">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-semibold text-gray-800">
                        {cat.name}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-400 truncate max-w-xs">
                      {cat.description || (
                        <span className="text-gray-200">-</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {cat.productsCount ?? 0}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/categories/${cat.id}`)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="Detail"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Total:{" "}
            <span className="font-semibold text-gray-600">
              {meta.totalItems}
            </span>{" "}
            categories
          </p>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-7 w-full max-w-md mx-4 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editId ? "Edit Category" : "Tambah Category"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Nama category"
                  className={`w-full px-4 py-3 text-sm rounded-2xl border-2 ${errors.name ? "border-red-200 bg-red-50/50 focus:border-red-400" : "border-gray-100 bg-gray-50/80 focus:border-blue-400"} focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-300`}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-2 ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Deskripsi
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Deskripsi (opsional)"
                  rows={3}
                  className="w-full px-4 py-3 text-sm rounded-2xl border-2 border-gray-100 bg-gray-50/80 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all resize-none placeholder:text-gray-300"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={deleteId !== null}
        title="Hapus Category"
        message="Yakin ingin menghapus category ini? Data tidak bisa dikembalikan."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
