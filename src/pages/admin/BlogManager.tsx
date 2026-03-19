import { useState, useEffect } from 'react';
import { BookOpen, Plus, Pencil, Trash2, X, Check, Eye, EyeOff } from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: 'draft' | 'published';
    views: number;
    created: string;
}

const EMPTY: Partial<BlogPost> & { title: string; slug: string; excerpt: string; content: string; status: 'draft' | 'published' } = {
    title: '', slug: '', excerpt: '', content: '', status: 'draft',
};

export default function AdminBlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ open: boolean; editing: BlogPost | null }>({ open: false, editing: null });
    const [form, setForm] = useState({ ...EMPTY });
    const [saving, setSaving] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await pb.collection(Collections.BLOG).getList(1, 100, { sort: '-created' });
            setPosts(res.items as unknown as BlogPost[]);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    function openAdd() {
        setForm({ ...EMPTY });
        setModal({ open: true, editing: null });
    }

    function openEdit(p: BlogPost) {
        setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', content: p.content || '', status: p.status });
        setModal({ open: true, editing: p });
    }

    async function handleSave() {
        if (!form.title) return;
        setSaving(true);
        const data = {
            title: form.title,
            slug: form.slug || form.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            excerpt: form.excerpt,
            content: form.content,
            status: form.status,
        };
        try {
            if (modal.editing) {
                await pb.collection(Collections.BLOG).update(modal.editing.id, data);
            } else {
                await pb.collection(Collections.BLOG).create(data);
            }
            setModal({ open: false, editing: null });
            load();
        } catch (e: any) { alert('Lỗi: ' + e.message); }
        setSaving(false);
    }

    async function toggleStatus(p: BlogPost) {
        const newStatus = p.status === 'published' ? 'draft' : 'published';
        try {
            await pb.collection(Collections.BLOG).update(p.id, { status: newStatus });
            setPosts(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
        } catch (e: any) { alert(e.message); }
    }

    async function handleDelete(id: string) {
        if (!confirm('Xóa bài viết này?')) return;
        try {
            await pb.collection(Collections.BLOG).delete(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (e: any) { alert(e.message); }
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-[#1a1612]">
                    Blog <span className="text-base font-normal text-[#a09080]">({posts.length})</span>
                </h1>
                <button onClick={openAdd}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                    <Plus className="h-4 w-4" /> Viết bài mới
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E8D9C4] bg-white">
                {loading ? (
                    <div className="py-16 text-center text-sm text-[#a09080]">Đang tải...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="border-b border-[#f0e8dc] bg-[#FAFAF7]">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-[#6b5a44]">Tiêu đề</th>
                                <th className="px-4 py-3 text-center font-semibold text-[#6b5a44]">Trạng thái</th>
                                <th className="px-4 py-3 text-right font-semibold text-[#6b5a44]">Lượt xem</th>
                                <th className="px-4 py-3 text-right font-semibold text-[#6b5a44]">Ngày</th>
                                <th className="px-4 py-3 text-center font-semibold text-[#6b5a44]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(p => (
                                <tr key={p.id} className="border-b border-[#f9f4ee] hover:bg-[#FAFAF7] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <BookOpen className="h-4 w-4 text-[#C49B3D] flex-shrink-0" />
                                            <div>
                                                <div className="font-semibold text-[#1a1612]">{p.title}</div>
                                                {p.excerpt && <div className="text-xs text-[#a09080] line-clamp-1">{p.excerpt}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleStatus(p)}
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${p.status === 'published' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-[#f5f0e8] text-[#a09080] hover:bg-[#ede8de]'}`}>
                                            {p.status === 'published' ? <><Eye className="h-3 w-3" /> Đã đăng</> : <><EyeOff className="h-3 w-3" /> Nháp</>}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right text-[#6b5a44]">{(p.views || 0).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right text-[#a09080] text-xs">
                                        {new Date(p.created).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(p)}
                                                className="rounded-lg p-1.5 text-[#a09080] hover:bg-[#FDF6E8] hover:text-[#C49B3D] transition-colors">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)}
                                                className="rounded-lg p-1.5 text-[#a09080] hover:bg-red-50 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr><td colSpan={5} className="py-12 text-center text-sm text-[#a09080]">Chưa có bài viết nào</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {modal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#f0e8dc] px-6 py-4">
                            <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-semibold text-[#1a1612]">
                                {modal.editing ? 'Sửa bài viết' : 'Viết bài mới'}
                            </h2>
                            <button onClick={() => setModal({ open: false, editing: null })}
                                className="rounded-lg p-1.5 text-[#a09080] hover:bg-[#f5f0e8]">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Tiêu đề *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D]"
                                    placeholder="Tiêu đề bài viết..." />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Tóm tắt</label>
                                <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm outline-none focus:border-[#C49B3D] resize-none"
                                    placeholder="Mô tả ngắn hiển thị trên trang blog..." />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Nội dung (HTML)</label>
                                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={12}
                                    className="w-full rounded-xl border border-[#E8D9C4] px-4 py-2.5 text-sm font-mono outline-none focus:border-[#C49B3D] resize-none"
                                    placeholder="<h2>Tiêu đề phần</h2>&#10;<p>Nội dung...</p>" />
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-xs font-semibold text-[#6b5a44] uppercase tracking-wider">Trạng thái:</label>
                                <button
                                    onClick={() => setForm(f => ({ ...f, status: f.status === 'published' ? 'draft' : 'published' }))}
                                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${form.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#f5f0e8] text-[#a09080]'}`}>
                                    {form.status === 'published' ? <><Check className="h-3 w-3" /> Đã đăng</> : <><EyeOff className="h-3 w-3" /> Bản nháp</>}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#f0e8dc] px-6 py-4">
                            <button onClick={() => setModal({ open: false, editing: null })}
                                className="rounded-xl border border-[#E8D9C4] px-5 py-2.5 text-sm font-medium text-[#6b5a44] hover:bg-[#f5f0e8]">
                                Hủy
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                                style={{ background: 'linear-gradient(135deg,#C49B3D,#8B6D20)' }}>
                                {saving ? 'Đang lưu...' : (modal.editing ? 'Lưu thay đổi' : 'Đăng bài')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
