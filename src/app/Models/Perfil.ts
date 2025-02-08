import { Genero } from "./Genero";
import { Usuario } from "./Usuario";

export interface Perfil {
  id: number;
  nombre: string;
  apellidos: string;
  descripcion: string;
  email: string;
  imagen: string;
  generos: Genero;
  usuario: Usuario;
}
