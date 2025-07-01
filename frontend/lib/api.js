// API functions to interact with the backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Función auxiliar para hacer peticiones autenticadas
export async function fetchWithAuth(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    // Si el error es de autenticación (401), limpiamos el token
    if (response.status === 401) {
      logout();
    }
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar usuario');
    }
    
    return data;
  } catch (error) {
    console.error('Error de registro:', error);
    throw error;
  }
}

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    // Store the token in localStorage for future authenticated requests
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Error de login:', error);
    throw error;
  }
}

// Obtiene la información del perfil del usuario
export async function getUserProfile() {
  try {
    return await fetchWithAuth(`${API_URL}/user/perfil`);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    throw error;
  }
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export function isAuthenticated() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
}
