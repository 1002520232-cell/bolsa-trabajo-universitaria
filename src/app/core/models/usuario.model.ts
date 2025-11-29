export type UserRole = 'estudiante' | 'empresa' | 'admin';

export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  apellido: string;
  carrera?: string; // Only for estudiantes
  rol: UserRole;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields for empresas
  empresaNombre?: string;
  empresaDescripcion?: string;
  empresaUbicacion?: string;
  empresaSitioWeb?: string;
  // Profile fields
  imagenUrl?: string;
  cvUrl?: string;
  habilidades?: string[];
  descripcion?: string;
  telefono?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  sitioWebPersonal?: string;
}
