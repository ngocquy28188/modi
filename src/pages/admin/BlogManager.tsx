import { BookOpen, Plus, Calendar } from 'lucide-react';

const MOCK = [
    { id: '1', title: '5 Xu Hướng Nội Thất Module 2026', status: 'published', date: '2026-03-15', views: 1240 },
    { id: '2', title: 'Cách Bố Trí Phòng Ngủ Nhỏ 10m²', status: 'published', date: '2026-03-10', views: 890 },
    { id: '3', title: 'Smart Furniture — Tương Lai Nội Thất', status: 'draft', date: '2026-03-19', views: 0 },
];

export default function AdminBlogManager() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-display text-2xl font-bold text-slate-900">Quản lý Blog</h1>
                <button className="flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-gold-600 transition-all">
                    <Plus className="h-4 w-4" /> Viết bài mới
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Tiêu đề</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">Trạng thái</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Lượt xem</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK.map(p => (
                            <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-4 w-4 text-gold-500" />
                                        <span className="font-medium text-slate-900">{p.title}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${p.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {p.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right text-slate-500">{p.views.toLocaleString()}</td>
                                <td className="px-4 py-3 text-right text-slate-400 flex items-center justify-end gap-1"><Calendar className="h-3 w-3" />{new Date(p.date).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
