// Categories Page - CRUD categories (tabel, search, pagination, modal form, hapus)
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";
import Pagination from "../components/ui/Pagination";
import DeleteModal from "../components/ui/DeleteModal";
import { categoriesService } from "../services/categories.service";
import type { Category } from "../types/category.types";
import type { PaginationMeta } from "../types/api.types";
import { getErrorMessage } from "../utils/error";

export default function CategoriesPage() {
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
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [saving, setSaving] = useState(false);

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
    setFormName("");
    setFormDesc("");
    setShowForm(true);
  };

  // Buka form buat edit
  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setFormName(cat.name);
    setFormDesc(cat.description || "");
    setShowForm(true);
  };

  // Simpan form (create / update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Nama category wajib diisi");
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        await categoriesService.update(editId, {
          name: formName,
          description: formDesc,
        });
        toast.success("Category berhasil diupdate");
      } else {
        await categoriesService.create({
          name: formName,
          description: formDesc,
        });
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
      <Header title="Categories" />
      <div className="p-8">
        {/* Toolbar: search + tombol tambah */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shrink-0"
          >
            <Plus size={18} />
            Tambah Category
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600 w-12">
                  #
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Nama
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Deskripsi
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 w-24">
                  Products
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 w-28">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-gray-400">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 text-gray-500 truncate max-w-xs">
                      {cat.description || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                        {cat.productsCount ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
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
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Total: {meta.totalItems} categories
          </p>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal Form Tambah/Edit */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editId ? "Edit Category" : "Tambah Category"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nama category"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Deskripsi (opsional)"
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
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
