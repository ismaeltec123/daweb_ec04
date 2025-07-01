'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  logout, 
  isAdmin, 
  isAlumno,
  getCursos,
  getMisCursos,
  getUsuario
} from '@/lib/api';
import ProfileInfo from '@/components/ProfileInfo';
import withAuth from '@/components/withAuth';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState([]);
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener información del usuario
        const user = getUsuario();
        setUsuario(user);
        
        // Obtener cursos según el rol
        if (isAdmin()) {
          const cursosData = await getCursos();
          setCursos(cursosData);
        } else if (isAlumno()) {
          const misCursos = await getMisCursos();
          setCursos(misCursos);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Plataforma Educativa
              </Link>
            </div>
            <div className="flex items-center">
              {usuario && (
                <span className="mr-4 text-gray-700 hidden md:flex items-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-2">
                    {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : usuario.email.charAt(0).toUpperCase()}
                  </div>
                  <span>
                    {usuario.nombre || usuario.email} 
                    <span className="ml-1 text-sm text-gray-500">({usuario.rol})</span>
                  </span>
                </span>
              )}
              <button 
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Menú</h2>
              <div className="space-y-2 mt-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center p-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/perfil" 
                  className="flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </Link>
                {isAdmin() && (
                  <>
                    <Link 
                      href="/dashboard/cursos/nuevo" 
                      className="flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Crear Curso
                    </Link>
                    <Link 
                      href="/dashboard/inscripciones" 
                      className="flex items-center p-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Gestionar Inscripciones
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <ProfileInfo />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-blue-700">
                  {isAdmin() ? 'Todos los Cursos' : 'Mis Cursos'}
                </h2>
                {isAdmin() && (
                  <Link 
                    href="/dashboard/cursos/nuevo"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                  >
                    Crear Curso
                  </Link>
                )}
              </div>
              
              {cursos.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    {isAdmin() 
                      ? 'No hay cursos creados todavía. ¡Crea el primero!' 
                      : 'No estás inscrito en ningún curso todavía.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cursos.map((curso: any) => (
                    <div key={curso.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {curso.imagen ? (
                        <img 
                          src={curso.imagen} 
                          alt={curso.titulo} 
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                          <svg className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{curso.titulo}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {curso.descripcion || 'Sin descripción'}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {curso.nivel || 'Básico'}
                          </span>
                          {isAlumno() && curso.progreso !== undefined && (
                            <div className="w-full mt-2">
                              <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                  <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                      Progreso
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                      {curso.progreso}%
                                    </span>
                                  </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                  <div 
                                    style={{ width: `${curso.progreso}%` }} 
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                          <Link 
                            href={isAdmin() ? `/dashboard/cursos/${curso.id}` : `/dashboard/curso/${curso.id}`}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors"
                          >
                            {isAdmin() ? 'Editar' : 'Ver curso'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
