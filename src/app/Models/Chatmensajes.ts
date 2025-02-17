export interface ChatMensaje {
  id?: number;
  fecha: Date;
  mensaje: string;
  chatId: number;
  usuarioId: number;
  imagen?: string;
}
