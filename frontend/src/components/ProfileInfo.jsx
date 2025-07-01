'use client';

import { useState, useEffect } from 'react';
import { getUserProfile, getUsuario } from '@/lib/api';

export default function ProfileInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    async function fetchProfile() {
      try {
        // Primero intentamos obtener la información del localStorage
        const usuarioLocal = getUsuario();
        if (usuarioLocal) {
          setProfile({
            usuario: usuarioLocal,
            message: 'Información cargada desde almacenamiento local'
          });
          
          // Aún intentamos actualizar desde el servidor en segundo plano
          try {
            const data = await getUserProfile();
            setProfile(data);
          } catch (serverErr) {
            console.warn('No se pudo actualizar el perfil desde el servidor:', serverErr.message);
            // Continuamos con los datos locales, no mostramos error
          }
          
          setLoading(false);
          return;
        }
        
        // Si no hay datos en localStorage, hacemos la petición
        const data = await getUserProfile();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError(err.message || 'Error al cargar el perfil');
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <div className="animate-pulse flex flex-col">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <p className="text-red-500">{error}</p>
        <p className="text-gray-600 mt-2">Por favor, intenta iniciar sesión nuevamente</p>
      </div>
    );
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">Información del Perfil</h2>
      {profile && profile.usuario && (
        <div className="space-y-3">
          <div className="flex items-center mb-4">
            <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-3">
              {profile.usuario.nombre ? profile.usuario.nombre.charAt(0).toUpperCase() : profile.usuario.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-lg">{profile.usuario.nombre || profile.usuario.email}</p>
              <p className="text-gray-500 text-sm">{profile.usuario.email}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">ID:</span>
              <span className="font-medium text-gray-800">{profile.usuario.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="font-medium text-gray-800">{profile.usuario.email}</span>
            </div>
            {profile.usuario.nombre && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Nombre:</span>
                <span className="font-medium text-gray-800">{profile.usuario.nombre}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-gray-600 font-medium">Rol:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {profile.usuario.rol}
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
            {profile.message || 'Sesión activa'}
          </div>
        </div>
      )}
    </div>
  );
}
