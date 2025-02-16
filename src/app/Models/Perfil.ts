import { Usuario } from "./Usuario";
import {Genero} from "./Genero";

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
