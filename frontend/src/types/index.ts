export interface Usuario {
  id: number;
  email: string;
  nombre?: string;
  rol: 'admin' | 'alumno';
}

export interface Curso {
  id: number;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  duracion?: string | number;
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
  progreso?: number; // Solo para cursos en los que está inscrito un alumno
}

export interface Inscripcion {
  id: number;
  UsuarioId: number;
  CursoId: number;
  progreso: number;
  estado: 'activo' | 'completado' | 'cancelado';
  fechaInscripcion?: string;
  createdAt: string;
  updatedAt: string;
  Usuario?: Usuario;
  Curso?: Curso;
}