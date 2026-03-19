import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';
import { OrderStatusLabels, formatPrice } from '@/types/furniture';
import type { OrderStatus } from '@/types/furniture';

interface Order {
    id: string;
    customerName: string;
    phone: string;
    email?: string;
    shippingAddress: string;
    items: any[];
    totalAmount: number;
    shippingFee?: number;
    status: OrderStatus;
    paymentMethod: string;
    notes?: string;
    created: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
    PENDING: 'bg-amber-50 text-amber-700',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    PRODUCING: 'bg-purple-50 text-purple-700',
    SHIPPING: 'bg-cyan-50 text-cyan-700',
    DELIVERED: 'bg-emerald-50 text-emerald-700',
    CANCELLED: 'bg-red-50 text-red-600',
};

const STATUS_FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PRODUCING', 'SHIPPING', 'DELIVERED'];

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        try {
            const res = await pb.collection(Collections.ORDERS).getList(1, 200, { sort: '-created' });
            setOrders(res.items as unknown as Order[]);
        } catch (e) { console.error(e); }
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function updateStatus(id: string, status: OrderStatus) {
        try {
            await pb.collection(Collections.ORDERS).update(id, { status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        } catch (e: any) { alert(e.message); }
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold text-[#1a1612]">
                    Đơn hàng <span className="text-base font-normal text-[#a09080]">({orders.length})</span>
                </h1>
                <div className="flex gap-2">
                    {STATUS_FLOW.map(s => (
                        <span key={s} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLORS[s]}`}>
                            {orders.filter(o => o.status === s).length} {OrderStatusLabels[s]}
                        </span>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center text-sm text-[#a09080]">Đang tải...</div>
            ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-[#E8D9C4] bg-white p-16 text-center">
                    <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-[#c4b09a]" />
                    <p className="text-sm text-[#8a7a68]">Chưa có đơn hàng nào</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map(order => (
                        <div key={order.id} className="rounded-2xl border border-[#E8D9C4] bg-white overflow-hidden">
                            {/* Row */}
                            <div
                                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#FAFAF7] transition-colors"
                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                                <ChevronDown className={`h-4 w-4 text-[#a09080] flex-shrink-0 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-[#1a1612] text-sm">{order.customerName}</span>
                                        <span className="text-xs text-[#a09080]">{order.phone}</span>
                                    </div>
                                    <div className="text-xs text-[#a09080] truncate">{order.shippingAddress}</div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div style={{ fontFamily: 'var(--font-display)' }} className="font-semibold text-[#1a1612]">
                                        {formatPrice(order.totalAmount)}
                                    </div>
                                    <div className="text-xs text-[#a09080]">{new Date(order.created).toLocaleDateString('vi-VN')}</div>
                                </div>
                                <span className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLORS[order.status]}`}>
                                    {OrderStatusLabels[order.status]}
                                </span>
                            </div>

                            {/* Expanded detail */}
                            {expanded === order.id && (
                                <div className="border-t border-[#f0e8dc] px-5 py-4 bg-[#FAFAF7]">
                                    {/* Items */}
                                    {Array.isArray(order.items) && order.items.length > 0 && (
                                        <div className="mb-4">
                                            <div className="text-xs font-semibold text-[#6b5a44] uppercase tracking-wider mb-2">Sản phẩm</div>
                                            <div className="space-y-1.5">
                                                {order.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-[#5c5448]">{item.name || item.productId} × {item.quantity}</span>
                                                        <span className="font-medium text-[#1a1612]">{formatPrice(item.unitPrice * item.quantity)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {order.notes && (
                                        <div className="mb-4 text-xs text-[#6b5a44] bg-amber-50 rounded-lg px-3 py-2">
                                            📝 {order.notes}
                                        </div>
                                    )}

                                    {/* Status update */}
                                    <div>
                                        <div className="text-xs font-semibold text-[#6b5a44] uppercase tracking-wider mb-2">Cập nhật trạng thái</div>
                                        <div className="flex flex-wrap gap-2">
                                            {STATUS_FLOW.map(s => (
                                                <button key={s}
                                                    onClick={() => updateStatus(order.id, s)}
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border ${order.status === s
                                                        ? 'border-[#C49B3D] bg-[#C49B3D] text-white'
                                                        : 'border-[#E8D9C4] text-[#6b5a44] hover:border-[#C49B3D] hover:text-[#C49B3D]'
                                                        }`}>
                                                    {OrderStatusLabels[s]}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => updateStatus(order.id, 'CANCELLED')}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border ${order.status === 'CANCELLED'
                                                    ? 'border-red-400 bg-red-50 text-red-600'
                                                    : 'border-[#E8D9C4] text-[#a09080] hover:border-red-300 hover:text-red-500'
                                                    }`}>
                                                Hủy đơn
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
