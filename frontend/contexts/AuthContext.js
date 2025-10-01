import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import api from '../lib/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const tokenInCookie = Cookies.get('token');
        if (tokenInCookie) {
            try {
                const decoded = jwtDecode(tokenInCookie);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ id: decoded.id, role: decoded.role, fullName: decoded.fullName });
                    setToken(tokenInCookie);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken, redirectPath = '/manage/dashboard') => {
        try {
            const decoded = jwtDecode(newToken);
            setUser({ id: decoded.id, role: decoded.role, fullName: decoded.fullName });
            setToken(newToken);
            Cookies.set('token', newToken, { expires: 1, secure: process.env.NODE_ENV === 'production' });
            router.push(redirectPath);
        } catch (error) {
            console.error("Login failed: Invalid token", error);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        Cookies.remove('token');
        router.push('/login');
    };

    const value = { user, token, login, logout, isAuthenticated: !!token, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};