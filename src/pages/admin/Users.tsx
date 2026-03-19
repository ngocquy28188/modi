import { Search } from 'lucide-react';

const MOCK = [
    { id: '1', name: 'Nguyễn Minh Anh', email: 'anh@email.com', phone: '0912345678', role: 'CUSTOMER', orders: 3, joined: '2026-02-15' },
    { id: '2', name: 'Trần Văn Bình', email: 'binh@email.com', phone: '0987654321', role: 'CUSTOMER', orders: 1, joined: '2026-03-01' },
    { id: '3', name: 'Admin MODI', email: 'admin@modi.vn', phone: '0123456789', role: 'ADMIN', orders: 0, joined: '2026-01-01' },
];

export default function AdminUsers() {
    return (
        <div>
            <h1 className="text-display text-2xl font-bold text-slate-900 mb-6">Khách hàng</h1>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Tìm khách hàng..." className="flex-1 bg-transparent text-sm outline-none" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Khách hàng</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Liên hệ</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">Role</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Đơn hàng</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Ngày đăng ký</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK.map(u => (
                            <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">{u.name.charAt(0)}</div>
                                        <span className="font-medium text-slate-900">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-slate-600">{u.email}</div>
                                    <div className="text-xs text-slate-400">{u.phone}</div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${u.role === 'ADMIN' ? 'bg-gold-100 text-gold-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right text-slate-600">{u.orders}</td>
                                <td className="px-4 py-3 text-right text-slate-400">{new Date(u.joined).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
