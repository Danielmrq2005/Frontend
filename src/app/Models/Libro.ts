export interface Libro {
  id: number;
  nombre: string;
  descripcion: string;
  username: string;
  generos: string;
  imagen: string;
  autorId: number | null;
  likes: number;
  fecha_publicacion: Date;
  dislikes: number;
}
