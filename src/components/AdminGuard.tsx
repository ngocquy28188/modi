import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export default function AdminGuard({ children }: { children: ReactNode }) {
    const { user, isLoading, isAdmin } = useAuth();

    if (isLoading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>;
    if (!user || !isAdmin) return <Navigate to="/login" replace />;

    return <>{children}</>;
}
