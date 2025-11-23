export interface OfertaLaboral {
  id?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  ubicacion: string;
  salario?: number;
  tipoContrato: string;
  requisitos: string[];
  fechaPublicacion: Date;
  fechaExpiracion?: Date;
  empresaId: string;
  postulacionesCount: number;
  activa: boolean;
  modalidad?: string;
  empresaNombre?: string;
  postulaciones?: number;
  vacantes?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: string;
  createdAt?: any;
  imagenUrl?: string;
}
