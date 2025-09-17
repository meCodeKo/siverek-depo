'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import { User } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: {
    resource: string;
    action: string;
  };
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission,
  fallback 
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Login sayfası için yetkilendirme kontrolü yapmayalım
      if (pathname === '/login') {
        setLoading(false);
        return;
      }

      const currentUser = authService.getCurrentUser();
      
      if (!currentUser) {
        router.push('/login');
        return;
      }

      // Özel yetki kontrolü
      if (requiredPermission) {
        const hasPermission = authService.hasPermission(
          requiredPermission.resource,
          requiredPermission.action
        );
        
        if (!hasPermission) {
          router.push('/unauthorized');
          return;
        }
      }

      setUser(currentUser);
      setLoading(false);

      // Oturum süresini uzat
      authService.extendSession();
    };

    checkAuth();

    // Her 5 dakikada bir oturum kontrolü yap
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [pathname, router, requiredPermission]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Login sayfası için direkt render et
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Yetkisiz erişim
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Yetkisiz Erişim</h1>
          <p className="mt-2 text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}