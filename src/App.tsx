import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetail from './pages/ItemDetail';
import Cart from './pages/Cart';
import Blog from './pages/Blog';
import MyOrders from './pages/buyer/MyOrders';
import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import AdminReviews from './pages/admin/Reviews';
import AdminBlogManager from './pages/admin/BlogManager';
import AdminUsers from './pages/admin/Users';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        {/* Admin routes */}
                        <Route path="/admin" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
                        <Route path="/admin/orders" element={<AdminGuard><AdminLayout><AdminOrders /></AdminLayout></AdminGuard>} />
                        <Route path="/admin/products" element={<AdminGuard><AdminLayout><AdminProducts /></AdminLayout></AdminGuard>} />
                        <Route path="/admin/reviews" element={<AdminGuard><AdminLayout><AdminReviews /></AdminLayout></AdminGuard>} />
                        <Route path="/admin/blog" element={<AdminGuard><AdminLayout><AdminBlogManager /></AdminLayout></AdminGuard>} />
                        <Route path="/admin/users" element={<AdminGuard><AdminLayout><AdminUsers /></AdminLayout></AdminGuard>} />

                        {/* Public routes */}
                        <Route path="/*" element={
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/product/:id" element={<ItemDetail />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/category/:cat" element={<Home />} />
                                    <Route path="/orders" element={<MyOrders />} />
                                    <Route path="/blog" element={<Blog />} />
                                    <Route path="/blog/:slug" element={<Blog />} />
                                </Routes>
                            </Layout>
                        } />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
