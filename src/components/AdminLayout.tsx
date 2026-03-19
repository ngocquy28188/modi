import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Star, BookOpen, Users, Crown, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

const sidebarLinks = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { to: '/admin/products', label: 'Sản phẩm', icon: <Package className="h-4 w-4" /> },
    { to: '/admin/orders', label: 'Đơn hàng', icon: <ShoppingCart className="h-4 w-4" /> },
    { to: '/admin/reviews', label: 'Đánh giá', icon: <Star className="h-4 w-4" /> },
    { to: '/admin/blog', label: 'Blog', icon: <BookOpen className="h-4 w-4" /> },
    { to: '/admin/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const location = useLocation();

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-slate-200 bg-white">
                <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600">
                        <Crown className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-display text-lg font-bold text-slate-900">MODI Admin</span>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-all ${location.pathname === link.to
                                ? 'bg-gold-50 text-gold-700 font-medium shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-slate-100 p-3">
                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Về trang chủ
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="ml-56 flex-1">
                <div className="mx-auto max-w-6xl px-6 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
