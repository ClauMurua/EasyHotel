export enum TipoItem {
  Tour = 'tour',
  Comida = 'comida',
  Actividad = 'actividad'
}

export interface ItemCarrito {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tipo: TipoItem;
  // Campos específicos de Tour
  duracion?: string;
  rating?: number;
  // Campos específicos de Comida
  calorias?: number;
  tiempoPreparacion?: string;
  ingredientes?: string[];
  etiquetas?: string[];
  // Campos específicos de Actividad
  dificultad?: string;
  ubicacion?: string;
  incluye?: string[];
}

export interface ResumenPago {
  subtotal: number;
  impuestos: number;
  total: number;
  items: ItemCarrito[];
}