'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCurso } from '@/lib/api';
import Button from '@/components/Button';
import withAuth from '@/components/withAuth';

function NuevoCurso() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: '',
    duracion: '',
    nivel: 'Principiante',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      
      await createCurso(formData);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error al crear el curso:', error);
      setError(error.message || 'Error al crear el curso');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Curso</h1>
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
            
            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Curso'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withAuth(NuevoCurso, ['admin']);
