import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { pb, Collections } from '@/lib/pocketbase';
import type { RecordModel } from 'pocketbase';

interface AuthUser {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: 'CUSTOMER' | 'ADMIN';
    avatar: string;
    city: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: { email: string; password: string; passwordConfirm: string; name: string; phone: string }) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const LS_AUTH_KEY = 'modi_local_auth';
const LS_USERS_KEY = 'modi_local_users';

function mapUser(record: RecordModel): AuthUser {
    return {
        id: record.id,
        email: record.email as string,
        name: record.name as string,
        phone: (record.phone as string) || '',
        role: (record.role as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER',
        avatar: (record.avatar as string) || '',
        city: (record.city as string) || '',
    };
}

function getLocalUsers(): AuthUser[] {
    try { return JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]'); } catch { return []; }
}
function saveLocalUsers(users: AuthUser[]) {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}
function getLocalAuth(): AuthUser | null {
    try { return JSON.parse(localStorage.getItem(LS_AUTH_KEY) || 'null'); } catch { return null; }
}
function saveLocalAuth(user: AuthUser | null) {
    localStorage.setItem(LS_AUTH_KEY, user ? JSON.stringify(user) : 'null');
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const model = pb.authStore.record;
        if (model) {
            setUser(mapUser(model));
        } else {
            const localUser = getLocalAuth();
            if (localUser) setUser(localUser);
        }
        setIsLoading(false);

        const unsub = pb.authStore.onChange((_token, record) => {
            if (record) {
                const mapped = mapUser(record);
                setUser(mapped);
                saveLocalAuth(mapped);
            }
        });
        return unsub;
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const result = await pb.collection(Collections.USERS).authWithPassword(email, password);
            const mapped = mapUser(result.record);
            setUser(mapped);
            saveLocalAuth(mapped);
        } catch {
            const users = getLocalUsers();
            const found = users.find(u => u.email === email);
            if (!found) throw new Error('Email hoặc mật khẩu không đúng');
            setUser(found);
            saveLocalAuth(found);
        }
    }, []);

    const register = useCallback(async (data: { email: string; password: string; passwordConfirm: string; name: string; phone: string }) => {
        try {
            await pb.collection(Collections.USERS).create({ ...data, role: 'CUSTOMER' });
            await pb.collection(Collections.USERS).authWithPassword(data.email, data.password);
            const model = pb.authStore.record;
            if (model) {
                const mapped = mapUser(model);
                setUser(mapped);
                saveLocalAuth(mapped);
            }
        } catch {
            const users = getLocalUsers();
            if (users.find(u => u.email === data.email)) {
                throw new Error('Email đã được sử dụng');
            }
            const newUser: AuthUser = {
                id: 'local_' + Date.now().toString(36),
                email: data.email,
                name: data.name,
                phone: data.phone,
                role: 'CUSTOMER',
                avatar: '',
                city: '',
            };
            users.push(newUser);
            saveLocalUsers(users);
            setUser(newUser);
            saveLocalAuth(newUser);
        }
    }, []);

    const logout = useCallback(() => {
        pb.authStore.clear();
        saveLocalAuth(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
