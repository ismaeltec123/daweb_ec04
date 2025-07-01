'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/api';
import ProfileInfo from '@/components/ProfileInfo';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="w-full flex justify-between items-center py-6 px-8 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">Plataforma Educativa</div>
        {isLoggedIn ? (
          <div className="space-x-4">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors">
              Panel de Control
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md font-medium transition-colors">
              Registrarse
            </Link>
          </div>
        )}      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Bienvenido a la Plataforma Educativa</h1>
            
            {isLoggedIn ? (
              <p className="text-xl text-green-600 mb-8">Has iniciado sesión correctamente. Accede a tus cursos desde el panel de control.</p>
            ) : (
              <p className="text-xl text-gray-600 mb-8">La mejor plataforma para gestionar cursos y seguimiento académico. Inicia sesión o regístrate para comenzar.</p>
            )}
            
            {!isLoggedIn && (
              <div className="flex gap-4 mt-8">
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            {isLoggedIn ? (
              <div className="mb-8 w-full">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Tu Información</h2>
                {/* @ts-ignore */}
                <ProfileInfo />
              </div>
            ) : (
              <div className="bg-blue-50 p-8 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Características</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Gestión de cursos en tiempo real</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Seguimiento detallado del progreso</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Panel de control personalizado</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Roles específicos para profesores y alumnos</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>      </main>
      
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Plataforma Educativa</h3>
              <p className="text-gray-300">
                Ofrecemos la mejor experiencia para la gestión de cursos y seguimiento académico.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Panel de Control
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-white transition-colors">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contacto</h3>
              <p className="text-gray-300 mb-2">
                Email: info@plataformaeducativa.com
              </p>
              <p className="text-gray-300">
                Teléfono: +51 999 888 777
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Plataforma Educativa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
