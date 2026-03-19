import { Package, Plus, Search } from 'lucide-react';
import { ProductCategoryLabels, MaterialTypeLabels, formatPrice } from '@/types/furniture';
import StatusBadge from '@/components/StatusBadge';
import type { ProductStatus, ProductCategory, MaterialType } from '@/types/furniture';

interface ProductRow {
    id: string;
    name: string;
    category: ProductCategory;
    material: MaterialType;
    price: number;
    status: ProductStatus;
    sku: string;
}

const MOCK: ProductRow[] = [
    { id: '1', name: 'Giường Ngủ Module KARA', category: 'BEDROOM', material: 'MDF', price: 6990000, status: 'IN_STOCK', sku: 'MODI-BD-001' },
    { id: '2', name: 'Tủ Quần Áo MIKA 3 Cánh', category: 'BEDROOM', material: 'MFC', price: 9990000, status: 'IN_STOCK', sku: 'MODI-WD-001' },
    { id: '3', name: 'Sofa Module LUNA L-Shape', category: 'LIVING_ROOM', material: 'FABRIC', price: 14900000, status: 'IN_STOCK', sku: 'MODI-SF-001' },
    { id: '4', name: 'Bàn Làm Việc FLEXI', category: 'SMART', material: 'MIXED', price: 5990000, status: 'PRE_ORDER', sku: 'MODI-DK-001' },
];

export default function AdminProducts() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-display text-2xl font-bold text-slate-900">Sản phẩm</h1>
                <button className="flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-gold-600 transition-all">
                    <Plus className="h-4 w-4" /> Thêm sản phẩm
                </button>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Tìm sản phẩm..." className="flex-1 bg-transparent text-sm outline-none" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Sản phẩm</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Danh mục</th>
                            <th className="px-4 py-3 text-left font-medium text-slate-500">Chất liệu</th>
                            <th className="px-4 py-3 text-right font-medium text-slate-500">Giá</th>
                            <th className="px-4 py-3 text-center font-medium text-slate-500">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK.map(p => (
                            <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50"><Package className="h-4 w-4 text-gold-500" /></div>
                                        <div>
                                            <div className="font-medium text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-400">{p.sku}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-500">{ProductCategoryLabels[p.category]}</td>
                                <td className="px-4 py-3 text-slate-500">{MaterialTypeLabels[p.material]}</td>
                                <td className="px-4 py-3 text-right font-medium text-slate-900">{formatPrice(p.price)}</td>
                                <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
