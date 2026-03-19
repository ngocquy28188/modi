import { useState } from 'react';
import { Package, Clock } from 'lucide-react';
import { formatPrice } from '@/types/furniture';
import type { OrderStatus } from '@/types/furniture';
import StatusBadge from '@/components/StatusBadge';

interface MockOrder {
    id: string;
    date: string;
    status: OrderStatus;
    items: string[];
    total: number;
}

const MOCK_ORDERS: MockOrder[] = [
    { id: 'ORD-001', date: '2026-03-18', status: 'SHIPPING', items: ['Giường Ngủ Module KARA', 'Tủ Quần Áo MIKA'], total: 16980000 },
    { id: 'ORD-002', date: '2026-03-10', status: 'DELIVERED', items: ['Sofa Module LUNA L-Shape'], total: 14900000 },
];

export default function MyOrders() {
    const [orders] = useState<MockOrder[]>(MOCK_ORDERS);

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-display text-2xl font-bold text-slate-900 mb-6">Đơn hàng của tôi</h1>

            {orders.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-16 text-center">
                    <Package className="mx-auto mb-3 h-12 w-12 text-slate-200" />
                    <p className="text-sm text-slate-500">Chưa có đơn hàng nào</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-900">{order.id}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    {new Date(order.date).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                            <div className="text-sm text-slate-500 mb-2">{order.items.join(', ')}</div>
                            <div className="text-right text-sm font-bold text-gold-600">{formatPrice(order.total)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
