// models/pedido.interface.ts

// ============================================================
//  INTERFACES PARA EL SISTEMA DE INVENTARIO
//  (Coinciden con el modelo del backend)
// ============================================================

export interface IPedido {
  _id: string;
  name: string;
  description?: string;
  quantity: number;           // Cantidad solicitada
  estimatedPrice: number;     // Precio estimado
  actualPrice?: number;       // Precio real (lo pone el admin)
  sku?: string | null;        // SKU generado por inventario
  batchId?: string | null;    // Batch ID generado por inventario
  status: 'pendiente' | 'inventario' | 'completado' | 'rechazado';
  createdBy?: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IPaginationData {
  pedidos: IPedido[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface PedidoResponse {
  success: boolean;          // 🔥 CAMBIADO: 'status' -> 'success' (coincide con backend)
  message?: string;
  data: IPaginationData;
}

export interface SinglePedidoResponse {
  success: boolean;          // 🔥 CAMBIADO: 'status' -> 'success'
  message?: string;
  data: IPedido;
}