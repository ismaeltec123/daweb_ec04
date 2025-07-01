'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isAlumno } from '@/lib/api';

export default function withAuth(Component, allowedRoles = []) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = () => {
        if (!isAuthenticated()) {
          router.push('/login');
          return;
        }
        
        // If specific roles are required, check them
        if (allowedRoles.length > 0) {
          let hasAllowedRole = false;
          
          if (allowedRoles.includes('admin') && isAdmin()) {
            hasAllowedRole = true;
          }
          
          if (allowedRoles.includes('alumno') && isAlumno()) {
            hasAllowedRole = true;
          }
          
          if (!hasAllowedRole) {
            router.push('/dashboard');
            return;
          }
        }
        
        setLoading(false);
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
