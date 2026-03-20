import { useState, useEffect } from 'react';
import { Crown, Package, ShoppingCart, Users, Star, TrendingUp, Loader2 } from 'lucide-react';
import { pb, Collections } from '@/lib/pocketbase';
import { formatPrice } from '@/types/furniture';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, customers: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                // Fetch real counts & data in parallel
                const [products, orders, users, reviews] = await Promise.allSettled([
                    pb.collection(Collections.PRODUCTS).getFullList({ fields: 'id' }),
                    pb.collection(Collections.ORDERS).getFullList({ sort: '-created' }),
                    pb.collection(Collections.USERS).getFullList({ fields: 'id' }),
                    pb.collection(Collections.REVIEWS).getFullList({ sort: '-created' }),
                ]);

                const productList = products.status === 'fulfilled' ? products.value : [];
                const orderList = orders.status === 'fulfilled' ? orders.value : [];
                const userList = users.status === 'fulfilled' ? users.value : [];
                const reviewList = reviews.status === 'fulfilled' ? reviews.value : [];

                // Calculate revenue from DELIVERED orders
                const totalRevenue = orderList
                    .filter((o: any) => o.status === 'DELIVERED')
                    .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

                setStats({
                    revenue: totalRevenue,
                    orders: orderList.length,
                    products: productList.length,
                    customers: userList.length,
                });

                setRecentOrders(orderList.slice(0, 5));
                setRecentReviews(reviewList.slice(0, 5));
            } catch (e) {
                console.error('Dashboard load error:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const statCards = [
        { label: 'Doanh thu (đã giao)', value: stats.revenue ? formatPrice(stats.revenue) : '0đ', icon: <TrendingUp className="h-5 w-5" />, color: 'from-gold-400 to-gold-600' },
        { label: 'Đơn hàng', value: stats.orders.toString(), icon: <ShoppingCart className="h-5 w-5" />, color: 'from-blue-400 to-blue-600' },
        { label: 'Sản phẩm', value: stats.products.toString(), icon: <Package className="h-5 w-5" />, color: 'from-emerald-400 to-emerald-600' },
        { label: 'Người dùng', value: stats.customers.toString(), icon: <Users className="h-5 w-5" />, color: 'from-purple-400 to-purple-600' },
    ];

    const STATUS_VI: Record<string, string> = {
        PENDING: 'Chờ xác nhận',
        CONFIRMED: 'Đã xác nhận',
        PRODUCING: 'Đang sản xuất',
        SHIPPING: 'Đang giao',
        DELIVERED: 'Đã giao',
        CANCELLED: 'Đã hủy',
    };

    return (
        <div>
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
                    <Crown className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-display text-2xl font-bold text-slate-900">MODI Admin</h1>
                    <p className="text-sm text-slate-500">Quản lý cửa hàng nội thất module</p>
                </div>
                {loading && <Loader2 className="ml-auto h-5 w-5 animate-spin text-slate-400" />}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((s, i) => (
                    <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5">
                        <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                            {s.icon}
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                        <div className="text-xs text-slate-500">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Đơn hàng gần đây</h3>
                    {recentOrders.length === 0 ? (
                        <p className="text-sm text-slate-400">{loading ? 'Đang tải...' : 'Chưa có đơn hàng nào'}</p>
                    ) : (
                        <div className="space-y-3 text-sm">
                            {recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between">
                                    <div>
                                        <span className="text-slate-700 font-medium">{order.customerName || 'Khách'}</span>
                                        <span className="mx-2 text-slate-300">·</span>
                                        <span className="text-slate-400 text-xs">{STATUS_VI[order.status] || order.status}</span>
                                    </div>
                                    <span className="text-gold-600 font-medium">{formatPrice(order.totalAmount || 0)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Reviews */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Đánh giá mới</h3>
                    {recentReviews.length === 0 ? (
                        <p className="text-sm text-slate-400">{loading ? 'Đang tải...' : 'Chưa có đánh giá nào'}</p>
                    ) : (
                        <div className="space-y-3 text-sm text-slate-500">
                            {recentReviews.map((review: any) => (
                                <div key={review.id} className="flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span>{review.rating || 5}.0 — "{review.comment || review.content || 'Không có nội dung'}"</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
