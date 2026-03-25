"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
    id: number
    name?: string
    email: string
    isPro?: boolean
    expire?: string
}

interface CustomAuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (redirectUrl?: string) => void
    logout: () => void
    refreshAuth: () => Promise<void>
}

const CustomAuthContext = createContext<CustomAuthContextType | undefined>(undefined)

export function CustomAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check authentication status
    const checkAuth = async () => {
        try {
            const response = await fetch('/hts/api/v1/user', {
                method: 'GET',
                credentials: 'include',
            })

            if (response.ok) {
                const data = await response.json()
                if (data && data.email) {
                    setUser({
                        id: data.user_id || data.id,
                        name: data.name,
                        email: data.email,
                        isPro: data.isPro ?? data.is_pro,
                        expire: data.expire
                    })
                } else {
                    setUser(null)
                }
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Refresh auth state
    const refreshAuth = async () => {
        setIsLoading(true)
        await checkAuth()
    }

    // Login - redirect to backend login page
    const login = (redirectUrl?: string) => {
        const currentUrl = redirectUrl || (typeof window !== 'undefined' ? window.location.href : '')
        const apiHost = process.env.NEXT_PUBLIC_API_HOST || 'https://app.bytegush.com'
        const loginUrl = `${apiHost}/auth/login?redirect_url=${encodeURIComponent(currentUrl)}`
        window.location.href = loginUrl
    }

    // Logout
    const logout = async () => {
        try {
            await fetch('/hts/api/v1/auth/logout', {
                method: 'POST',
                credentials: 'include',
            })

            setUser(null)
            localStorage.setItem('auth_changed', Date.now().toString())
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    // Check auth on mount and when returning from login
    useEffect(() => {
        checkAuth()

        // Listen for storage events (for cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_changed') {
                checkAuth()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    // Check for redirect from login
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const loginSuccess = urlParams.get('login_success')

        if (loginSuccess === 'true') {
            // Remove query param and refresh auth
            const newUrl = window.location.pathname
            window.history.replaceState({}, '', newUrl)
            checkAuth()

            // Notify other tabs
            localStorage.setItem('auth_changed', Date.now().toString())
        }
    }, [])

    const value: CustomAuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAuth
    }

    return (
        <CustomAuthContext.Provider value={value}>
            {children}
        </CustomAuthContext.Provider>
    )
}

export function useCustomAuth() {
    const context = useContext(CustomAuthContext)
    if (context === undefined) {
        throw new Error('useCustomAuth must be used within CustomAuthProvider')
    }
    return context
}
