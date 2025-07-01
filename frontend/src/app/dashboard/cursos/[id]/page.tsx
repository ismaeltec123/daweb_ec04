'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCursoById, updateCurso, deleteCurso } from '@/lib/api';
import Button from '@/components/Button';
import withAuth from '@/components/withAuth';
import { Curso } from '@/types';

interface FormData {
  titulo: string;
  descripcion: string;
  imagen: string;
  duracion: string;
  nivel: string;
  activo: boolean;
}

function EditarCurso({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    imagen: '',
    duracion: '',
    nivel: 'Principiante',
    activo: true
  });

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        setLoading(true);
        const curso = await getCursoById(id);
        setFormData({
          titulo: curso.titulo || '',
          descripcion: curso.descripcion || '',
          imagen: curso.imagen || '',
          duracion: curso.duracion?.toString() || '',
          nivel: curso.nivel || 'Principiante',
          activo: curso.activo !== undefined ? curso.activo : true
        });
      } catch (error: unknown) {
        console.error('Error al obtener el curso:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurso();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo) {
      setError('El título es obligatorio');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await updateCurso(id, formData);
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Error al actualizar el curso:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      try {
        setDeleteLoading(true);
        await deleteCurso(id);
        router.push('/dashboard');
      } catch (error: unknown) {
        console.error('Error al eliminar el curso:', error);
        setError(error instanceof Error ? error.message : 'Error al eliminar el curso');
        setDeleteLoading(false);
      }
    }
  };

  if (loading && !formData.titulo) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar Curso</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            Volver al Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Título del curso"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción del curso"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                URL de la imagen
              </label>
              <input
                id="imagen"
                name="imagen"
                type="text"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-1">
                Duración
              </label>
              <input
                id="duracion"
                name="duracion"
                type="text"
                value={formData.duracion}
                onChange={handleChange}
                placeholder="8 semanas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="nivel" className="block text-sm font-medium text-gray-700 mb-1">
                Nivel
              </label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="activo"
                name="activo"
                type="checkbox"
                checked={formData.activo}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                Curso activo
              </label>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar Curso'}
              </Button>
              
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(EditarCurso, ['admin']);
