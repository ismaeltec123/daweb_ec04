'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getAllInscripciones, 
  inscribirAlumno, 
  cancelarInscripcion, 
  getCursos
} from '@/lib/api';
import Button from '@/components/Button';
import withAuth from '@/components/withAuth';

interface Usuario {
  id: number;
  email: string;
  nombre: string;
}

interface Curso {
  id: number;
  titulo: string;
  nivel: string;
}

interface Inscripcion {
  id: number;
  progreso: number;
  estado: string;
  fechaInscripcion: string;
  Usuario: Usuario;
  Curso: Curso;
}

function GestionInscripciones() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creatingEnrollment, setCreatingEnrollment] = useState(false);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [error, setError] = useState('');
  const [nuevoAlumno, setNuevoAlumno] = useState('');
  const [nuevoCursoId, setNuevoCursoId] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener inscripciones y cursos
        const [inscripcionesData, cursosData] = await Promise.all([
          getAllInscripciones(),
          getCursos()
        ]);
        
        setInscripciones(inscripcionesData);
        setCursos(cursosData);
      } catch (error: any) {
        console.error('Error al cargar datos:', error);
        setError(error.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleCreateInscripcion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoAlumno || !nuevoCursoId) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    try {
      setCreatingEnrollment(true);
      setError('');
      
      // Intentar convertir el email a ID
      let alumnoId = 0;
      try {
        alumnoId = parseInt(nuevoAlumno);
        if (isNaN(alumnoId)) {
          throw new Error('ID inválido');
        }
      } catch {
        // Si no es un número, asumimos que es un email
        setError('Por favor ingrese un ID de alumno válido');
        setCreatingEnrollment(false);
        return;
      }
      
      await inscribirAlumno(parseInt(nuevoCursoId), alumnoId);
      
      // Recargar las inscripciones
      const inscripcionesData = await getAllInscripciones();
      setInscripciones(inscripcionesData);
      
      // Limpiar el formulario
      setNuevoAlumno('');
      setNuevoCursoId('');
    } catch (error: any) {
      console.error('Error al crear inscripción:', error);
      setError(error.message || 'Error al crear la inscripción');
    } finally {
      setCreatingEnrollment(false);
    }
  };

  const handleCancelarInscripcion = async (inscripcionId: number) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta inscripción?')) {
      try {
        await cancelarInscripcion(inscripcionId);
        
        // Actualizar la lista de inscripciones
        setInscripciones(prev => 
          prev.map(inscripcion => 
            inscripcion.id === inscripcionId 
              ? { ...inscripcion, estado: 'cancelado' } 
              : inscripcion
          )
        );
      } catch (error: any) {
        console.error('Error al cancelar inscripción:', error);
        setError(error.message || 'Error al cancelar la inscripción');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Inscripciones</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Volver al Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario para crear nueva inscripción */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Nueva Inscripción</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleCreateInscripcion} className="space-y-4">
                <div>
                  <label htmlFor="nuevoAlumno" className="block text-sm font-medium text-gray-700 mb-1">
                    ID del Alumno <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nuevoAlumno"
                    type="text"
                    value={nuevoAlumno}
                    onChange={(e) => setNuevoAlumno(e.target.value)}
                    placeholder="ID del alumno"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="nuevoCursoId" className="block text-sm font-medium text-gray-700 mb-1">
                    Curso <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="nuevoCursoId"
                    value={nuevoCursoId}
                    onChange={(e) => setNuevoCursoId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccionar curso</option>
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.titulo} ({curso.nivel})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={creatingEnrollment}
                  >
                    {creatingEnrollment ? 'Inscribiendo...' : 'Inscribir Alumno'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Lista de inscripciones */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Inscripciones</h2>
              
              {inscripciones.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay inscripciones registradas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Alumno
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progreso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {inscripciones.map(inscripcion => (
                        <tr key={inscripcion.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {inscripcion.Usuario.nombre || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inscripcion.Usuario.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              ID: {inscripcion.Usuario.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {inscripcion.Curso.titulo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inscripcion.Curso.nivel}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-blue-200">
                                <div 
                                  style={{ width: `${inscripcion.progreso}%` }} 
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                ></div>
                              </div>
                              <div className="text-xs text-gray-600">
                                {inscripcion.progreso}%
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              inscripcion.estado === 'activo' 
                                ? 'bg-green-100 text-green-800' 
                                : inscripcion.estado === 'completado' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {inscripcion.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {inscripcion.estado === 'activo' && (
                              <button
                                onClick={() => handleCancelarInscripcion(inscripcion.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(GestionInscripciones, ['admin']);
