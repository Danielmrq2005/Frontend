export interface Libro {
  id: number;
  nombre: string;
  descripcion: string;
  username: string;
  generos: string;
  imagen: string;
  autorId: number | null;
  likes: number;
  fechaPublicacion: Date;
  dislikes: number;
  totalComentarios?: number;
}
