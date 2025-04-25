"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/ApiService';
import {  disconnectSocket } from '../services/socketSevice';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await authAPI.register(userData);
            toast.success('Registration successful!');
            router.push('/');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await authAPI.login(credentials);
            const { token, data } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data))
            setUser(data);
            toast.success('Login successful!');
           router.push('/chat');
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        disconnectSocket();
        setUser(null);
        toast.success('Logged out successfully');
        router.push('/');
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
