import { useState, useEffect, useRef } from 'react';
import { Package, Plus, Search, Pencil, Trash2, X, Upload, Check } from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';
import { ProductCategoryLabels, MaterialTypeLabels, formatPrice } from '@/types/furniture';
import type { ProductCategory, MaterialType, ProductStatus, Product } from '@/types/furniture';
import StatusBadge from '@/components/StatusBadge';

const EMPTY_FORM = {
    name: '', slug: '', category: 'BEDROOM' as ProductCategory,
    material: 'MDF' as MaterialType, dimensions: '', price: '',
    salePrice: '', description: '', features: '', colors: '',
    status: 'IN_STOCK' as ProductStatus, sku: '',
};

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    async function load() {
        setLoading(true);
        try {
            const res = await pb.collection(Collections.PRODUCTS).getList(1, 200, { sort: '-created' });
            setProducts(res.items as unknown as Product[]);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    function openAdd() {
        setForm(EMPTY_FORM);
        setImageFile(null);
        setModal({ open: true, editing: null });
    }

    function openEdit(p: Product) {
        setForm({
            name: p.name, slug: p.slug, category: p.category,
            material: p.material, dimensions: p.dimensions || '',
            price: String(p.price), salePrice: String(p.salePrice || ''),
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features.join('\n') : '',
            colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
            status: p.status, sku: p.sku || '',
        });
        setImageFile(null);
        setModal({ open: true, editing: p });
    }

    async function handleSave() {
        if (!form.name || !form.price) return;
        setSaving(true);
        try {
            const data = new FormData();
            data.append('name', form.name);
            data.append('slug', form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
            data.append('category', form.category);
            data.append('material', form.material);
            data.append('dimensions', form.dimensions);
            data.append('price', form.price);
            if (form.salePrice) data.append('salePrice', form.salePrice);
            data.append('description', form.description);
            data.append('features', JSON.stringify(form.features.split('\n').filter(Boolean)));
            data.append('colors', JSON.stringify(form.colors.split(',').map(c => c.trim()).filter(Boolean)));
            data.append('status', form.status);
            data.append('sku', form.sku);
            if (imageFile) data.append('images', imageFile);

            if (modal.editing) {
                await pb.collection(Collections.PRODUCTS).update(modal.editing.id, data);
            } else {
                await pb.collection(Collections.PRODUCTS).create(data);
            }
            setModal({ open: false, editing: null });
            load();
        } catch (e: any) {
            alert('Lỗi: ' + (e.message || 'Không thể lưu sản phẩm'));
        }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Xóa sản phẩm này?')) return;
        setDeleting(id);
        try {
            await pb.collection(Collections.PRODUCTS).delete(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e: any) { alert('Lỗi xóa: ' + e.message); }
        setDeleting(null);
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-[#1a1612]">
                    Sản phẩm <span className="text-base font-normal text-[#a09080]">({products.length})</span>
                </h1>
                <button onClick={openAdd}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                    <Plus className="h-4 w-4" /> Thêm sản phẩm
                </button>
            </div>

            {/* Search */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#E8D9C4] bg-white px-4 py-2.5">
                <Search className="h-4 w-4 text-[#a09080]" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm theo tên, SKU..." className="flex-1 bg-transparent text-sm outline-none" />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-[#E8D9C4] bg-white">
                {loading ? (
                    <div className="py-16 text-center text-sm text-[#a09080]">Đang tải...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b border-[#f0e8dc] bg-[#FAFAF7]">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-[#6b5a44]">Sản phẩm</th>
                                <th className="px-4 py-3 text-left font-semibold text-[#6b5a44]">Danh mục</th>
                                <th className="px-4 py-3 text-right font-semibold text-[#6b5a44]">Giá</th>
                                <th className="px-4 py-3 text-center font-semibold text-[#6b5a44]">Trạng thái</th>
                                <th className="px-4 py-3 text-center font-semibold text-[#6b5a44]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-[#f9f4ee] hover:bg-[#FAFAF7] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {/* Thumbnail or placeholder */}
                                            {p.images?.length > 0 ? (
                                                <img src={pb.files.getURL(p as any, p.images[0], { thumb: '60x60' })}
                                                    className="h-9 w-9 rounded-lg object-cover border border-[#E8D9C4]" alt="" />
                                            ) : (
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDF6E8]">
                                                    <Package className="h-4 w-4 text-[#C49B3D]" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-[#1a1612]">{p.name}</div>
                                                <div className="text-xs text-[#a09080]">{p.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-[#6b5a44]">{ProductCategoryLabels[p.category]}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="font-semibold text-[#1a1612]">{formatPrice(p.salePrice || p.price)}</div>
                                        {p.salePrice && <div className="text-xs text-[#a09080] line-through">{formatPrice(p.price)}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(p)}
                                                className="rounded-lg p-1.5 text-[#a09080] hover:bg-[#FDF6E8] hover:text-[#C49B3D] transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                                                className="rounded-lg p-1.5 text-[#a09080] hover:bg-red-50 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={5} className="py-12 text-center text-sm text-[#a09080]">Không tìm thấy sản phẩm</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#f0e8dc] px-6 py-4">
                            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-semibold text-[#1a1612]">
                                {modal.editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                            </h2>
                            <button onClick={() => setModal({ open: false, editing: null })}
                                className="rounded-lg p-1.5 text-[#a09080] hover:bg-[#f5f0e8]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Tên */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Tên sản phẩm *</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D] focus:ring-2 focus:ring-[#C49B3D]/15"
                                    placeholder="VD: Giường Ngủ Module KARA" />
                            </div>

                            {/* Category + Material */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Danh mục</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]">
                                        {Object.entries(ProductCategoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Chất liệu</label>
                                    <select value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value as MaterialType }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]">
                                        {Object.entries(MaterialTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Giá */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Giá gốc (đ) *</label>
                                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                        placeholder="8500000" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Giá khuyến mãi (đ)</label>
                                    <input type="number" value={form.salePrice} onChange={e => setForm(f => ({ ...f, salePrice: e.target.value }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                        placeholder="Bỏ trống nếu không sale" />
                                </div>
                            </div>

                            {/* SKU + Dimensions */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">SKU</label>
                                    <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                        placeholder="MODI-BD-001" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Kích thước</label>
                                    <input value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))}
                                        className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                        placeholder="2000 × 1600 × 350mm" />
                                </div>
                            </div>

                            {/* Trạng thái */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Trạng thái</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProductStatus }))}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]">
                                    <option value="IN_STOCK">Còn hàng</option>
                                    <option value="PRE_ORDER">Đặt trước</option>
                                    <option value="OUT_OF_STOCK">Hết hàng</option>
                                </select>
                            </div>

                            {/* Mô tả */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Mô tả</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D] resize-none"
                                    placeholder="Mô tả ngắn về sản phẩm..." />
                            </div>

                            {/* Tính năng */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Tính năng (mỗi dòng 1 tính năng)</label>
                                <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={3}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D] resize-none"
                                    placeholder="Tháo lắp 15 phút&#10;Gỗ MDF chống ẩm&#10;Ngăn kéo tích hợp" />
                            </div>

                            {/* Màu sắc */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Màu sắc (cách nhau bằng dấu phẩy)</label>
                                <input value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                    placeholder="Trắng, Vân Sồi, Đen" />
                            </div>

                            {/* Upload ảnh */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Ảnh sản phẩm</label>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#E8D9C4] bg-[#FAFAF7] py-6 transition-colors hover:border-[#C49B3D]">
                                    {imageFile ? (
                                        <><Check className="h-6 w-6 text-emerald-500" /><span className="text-sm text-emerald-600">{imageFile.name}</span></>
                                    ) : (
                                        <><Upload className="h-6 w-6 text-[#C49B3D]" /><span className="text-sm text-[#a09080]">Click để chọn ảnh (JPG, PNG, WebP)</span></>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                    onChange={e => setImageFile(e.target.files?.[0] || null)} />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t border-[#f0e8dc] px-6 py-4">
                            <button onClick={() => setModal({ open: false, editing: null })}
                                className="rounded-xl border border-[#E8D9C4] px-5 py-2.5 text-sm font-medium text-[#6b5a44] hover:bg-[#f5f0e8] transition-colors">
                                Hủy
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                                {saving ? 'Đang lưu...' : (modal.editing ? 'Lưu thay đổi' : 'Thêm sản phẩm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
