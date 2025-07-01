'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCursoById, actualizarProgreso, getMisInscripciones } from '@/lib/api';
import Button from '@/components/Button';
import withAuth from '@/components/withAuth';

function DetalleCurso({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [curso, setCurso] = useState<any>(null);
  const [inscripcion, setInscripcion] = useState<any>(null);
  const [nuevoProgreso, setNuevoProgreso] = useState<number>(0);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener detalles del curso
        const cursoData = await getCursoById(id);
        setCurso(cursoData);
        
        // Obtener la inscripción del usuario para este curso
        const inscripciones = await getMisInscripciones();
        const miInscripcion = inscripciones.find((insc: any) => insc.CursoId === parseInt(id));
        
        if (miInscripcion) {
          setInscripcion(miInscripcion);
          setNuevoProgreso(miInscripcion.progreso);
        } else {
          // Si no está inscrito, redirigir al dashboard
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Error al cargar el curso:', error);
        setError(error.message || 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, router]);

  const handleActualizarProgreso = async () => {
    try {
      setActualizando(true);
      
      if (!inscripcion) {
        throw new Error('No se encontró la inscripción');
      }
      
      // Determinar si el curso está completado
      const nuevoEstado = nuevoProgreso >= 100 ? 'completado' : 'activo';
      
      await actualizarProgreso(inscripcion.id, nuevoProgreso, nuevoEstado);
      
      // Actualizar el estado local
      setInscripcion({
        ...inscripcion,
        progreso: nuevoProgreso,
        estado: nuevoEstado
      });
      
      alert('Progreso actualizado correctamente');
    } catch (error: any) {
      console.error('Error al actualizar el progreso:', error);
      setError(error.message || 'Error al actualizar el progreso');
    } finally {
      setActualizando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Curso no encontrado</h1>
            <p className="mb-6 text-gray-600">El curso que buscas no existe o no tienes acceso a él.</p>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Detalle del Curso</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Volver al Dashboard
          </Link>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {curso.imagen ? (
            <img 
              src={curso.imagen} 
              alt={curso.titulo} 
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{curso.titulo}</h2>
            
            <div className="flex items-center mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {curso.nivel}
              </span>
              {curso.duracion && (
                <span className="ml-3 text-gray-600 text-sm">
                  Duración: {curso.duracion}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Descripción</h3>
              <p className="text-gray-700">
                {curso.descripcion || 'Este curso no tiene descripción.'}
              </p>
            </div>
            
            {inscripcion && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-4">Tu Progreso</h3>
                
                <div className="mb-4">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Progreso Actual
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {inscripcion.progreso}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div 
                      style={{ width: `${inscripcion.progreso}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="nuevoProgreso" className="block text-sm font-medium text-gray-700 mb-1">
                    Actualizar Progreso
                  </label>
                  <input
                    id="nuevoProgreso"
                    type="range"
                    min="0"
                    max="100"
                    value={nuevoProgreso}
                    onChange={(e) => setNuevoProgreso(parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium">{nuevoProgreso}%</span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleActualizarProgreso}
                    disabled={actualizando || nuevoProgreso === inscripcion.progreso}
                  >
                    {actualizando ? 'Actualizando...' : 'Guardar Progreso'}
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium text-gray-800 mb-2">Estado de tu inscripción</h4>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      inscripcion.estado === 'activo' 
                        ? 'bg-green-100 text-green-800' 
                        : inscripcion.estado === 'completado' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {inscripcion.estado === 'activo' 
                        ? 'En curso' 
                        : inscripcion.estado === 'completado' 
                          ? 'Completado' 
                          : 'Cancelado'}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      Fecha de inscripción: {new Date(inscripcion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DetalleCurso, ['alumno']);
