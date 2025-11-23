export interface Empresa {
  id?: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  sitioWeb?: string;
  email: string;
  telefono?: string;
  fechaCreacion: Date;
  userId: string;
  sector?: string;
  ruc?: string;
  createdBy?: string;
  imagenUrl?: string;
}
