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
  } else {
    console.error('No se encontró token de autenticación');
    throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.');
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Si el error es de autenticación (401), limpiamos el token
      if (response.status === 401) {
        console.error('Error de autenticación:', data.message);
        logout();
      }
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    throw error;
  }
}

// AUTENTICACIÓN
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
      console.error('Error en registro:', data.message, data.error);
      throw new Error(data.message || 'Error al registrar usuario');
    }
    
    // Store the token after registration
    if (data.token) {
      localStorage.setItem('token', data.token);
      // Guardar información del usuario también
      if (data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }
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
      console.error('Error en login:', data.message, data.error);
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    // Store the token in localStorage for future authenticated requests
    if (data.token) {
      localStorage.setItem('token', data.token);
      // Guardar información del usuario también
      if (data.usuario) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      }
    } else {
      console.error('No se recibió token en la respuesta de login');
      throw new Error('Error de autenticación: No se recibió token');
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

// CURSOS
export async function getCursos() {
  try {
    return await fetchWithAuth(`${API_URL}/cursos`);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    throw error;
  }
}

export async function getCursoById(id) {
  try {
    return await fetchWithAuth(`${API_URL}/cursos/${id}`);
  } catch (error) {
    console.error(`Error al obtener curso ${id}:`, error);
    throw error;
  }
}

export async function getMisCursos() {
  try {
    return await fetchWithAuth(`${API_URL}/cursos/mis-cursos`);
  } catch (error) {
    console.error('Error al obtener mis cursos:', error);
    throw error;
  }
}

export async function createCurso(cursoData) {
  try {
    return await fetchWithAuth(`${API_URL}/cursos`, {
      method: 'POST',
      body: JSON.stringify(cursoData)
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    throw error;
  }
}

export async function updateCurso(id, cursoData) {
  try {
    return await fetchWithAuth(`${API_URL}/cursos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cursoData)
    });
  } catch (error) {
    console.error(`Error al actualizar curso ${id}:`, error);
    throw error;
  }
}

export async function deleteCurso(id) {
  try {
    return await fetchWithAuth(`${API_URL}/cursos/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Error al eliminar curso ${id}:`, error);
    throw error;
  }
}

// INSCRIPCIONES
export async function inscribirAlumno(cursoId, alumnoId) {
  try {
    return await fetchWithAuth(`${API_URL}/inscripciones`, {
      method: 'POST',
      body: JSON.stringify({ cursoId, alumnoId })
    });
  } catch (error) {
    console.error('Error al inscribir alumno:', error);
    throw error;
  }
}

export async function getMisInscripciones() {
  try {
    return await fetchWithAuth(`${API_URL}/inscripciones/mis-inscripciones`);
  } catch (error) {
    console.error('Error al obtener mis inscripciones:', error);
    throw error;
  }
}

export async function getAllInscripciones() {
  try {
    return await fetchWithAuth(`${API_URL}/inscripciones`);
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    throw error;
  }
}

export async function actualizarProgreso(inscripcionId, progreso, estado) {
  try {
    return await fetchWithAuth(`${API_URL}/inscripciones/${inscripcionId}/progreso`, {
      method: 'PUT',
      body: JSON.stringify({ progreso, estado })
    });
  } catch (error) {
    console.error(`Error al actualizar progreso:`, error);
    throw error;
  }
}

export async function cancelarInscripcion(inscripcionId) {
  try {
    return await fetchWithAuth(`${API_URL}/inscripciones/${inscripcionId}/cancelar`, {
      method: 'PUT'
    });
  } catch (error) {
    console.error(`Error al cancelar inscripción:`, error);
    throw error;
  }
}

// UTILIDADES
export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function getUsuario() {
  if (typeof window !== 'undefined') {
    const usuarioJSON = localStorage.getItem('usuario');
    if (usuarioJSON) {
      return JSON.parse(usuarioJSON);
    }
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}

export function isAuthenticated() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false;
}

export function isAdmin() {
  const usuario = getUsuario();
  return usuario && usuario.rol === 'admin';
}

export function isAlumno() {
  const usuario = getUsuario();
  return usuario && usuario.rol === 'alumno';
}
