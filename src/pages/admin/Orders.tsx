import { Clock, Search } from 'lucide-react';
import { formatPrice } from '@/types/furniture';
import StatusBadge from '@/components/StatusBadge';
import type { OrderStatus } from '@/types/furniture';

interface OrderRow { id: string; customer: string; date: string; total: number; status: OrderStatus; items: string; }

const MOCK: OrderRow[] = [
    { id: 'ORD-047', customer: 'Nguyễn Minh Anh', date: '2026-03-18', total: 24900000, status: 'CONFIRMED', items: 'Combo Phòng Ngủ SAKURA' },
    { id: 'ORD-046', customer: 'Trần Văn Bình', date: '2026-03-17', total: 14900000, status: 'PRODUCING', items: 'Sofa Module LUNA' },
    { id: 'ORD-045', customer: 'Lê Thị Cẩm', date: '2026-03-16', total: 13980000, status: 'SHIPPING', items: 'Giường KARA × 2' },
    { id: 'ORD-044', customer: 'Phạm Đức Dũng', date: '2026-03-15', total: 49900000, status: 'DELIVERED', items: 'Combo Studio URBAN' },
];

export default function AdminOrders() {
    return (
        <div>
            <h1 className="text-display text-2xl font-bold text-slate-900 mb-6">Đơn hàng</h1>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Tìm đơn hàng..." className="flex-1 bg-transparent text-sm outline-none" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Mã đơn</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Khách hàng</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Sản phẩm</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Tổng tiền</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">Trạng thái</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Ngày</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK.map(o => (
                            <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-900">{o.id}</td>
                                <td className="px-4 py-3 text-slate-600">{o.customer}</td>
                                <td className="px-4 py-3 text-slate-500">{o.items}</td>
                                <td className="px-4 py-3 text-right font-medium text-gold-600">{formatPrice(o.total)}</td>
                                <td className="px-4 py-3 text-center"><StatusBadge status={o.status} /></td>
                                <td className="px-4 py-3 text-right text-slate-400 flex items-center justify-end gap-1"><Clock className="h-3 w-3" />{new Date(o.date).toLocaleDateString('vi-VN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
