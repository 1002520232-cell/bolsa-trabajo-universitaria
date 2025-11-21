export interface Postulacion {
  id?: string;
  ofertaId: string;
  estudianteId: string;
  fechaPostulacion: Date;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'revisada';
  mensaje?: string;
  ofertaTitulo?: string;
  empresaNombre?: string;
  fechaRevision?: Date;
  notas?: string;
}
