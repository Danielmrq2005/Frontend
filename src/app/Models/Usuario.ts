import { Rol } from "./Rol";

export interface Usuario {
  id: number;
  username: string;
  password: string;
  rol: Rol;
}
