import type { ProductStatus, OrderStatus } from '@/types/furniture';
import { ProductStatusLabels, OrderStatusLabels } from '@/types/furniture';

const statusColors: Record<string, string> = {
    IN_STOCK: 'bg-emerald-50 text-emerald-600',
    PRE_ORDER: 'bg-amber-50 text-amber-600',
    OUT_OF_STOCK: 'bg-red-50 text-red-600',
    PENDING: 'bg-slate-100 text-slate-600',
    CONFIRMED: 'bg-blue-50 text-blue-600',
    PRODUCING: 'bg-gold-50 text-gold-700',
    SHIPPING: 'bg-indigo-50 text-indigo-600',
    DELIVERED: 'bg-emerald-50 text-emerald-600',
    CANCELLED: 'bg-red-50 text-red-500',
};

export default function StatusBadge({ status }: { status: ProductStatus | OrderStatus }) {
    const label = (ProductStatusLabels as Record<string, string>)[status]
        || (OrderStatusLabels as Record<string, string>)[status]
        || status;
    const color = statusColors[status] || 'bg-slate-100 text-slate-500';

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${color}`}>
            {label}
        </span>
    );
}
