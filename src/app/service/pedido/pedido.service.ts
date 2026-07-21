// services/pedido.service.ts (Frontend de Inventario)
import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { PedidoResponse, SinglePedidoResponse } from 'src/app/models/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private apiService: ApiService) {}

  // ============================================================
  //  MÉTODOS EXISTENTES
  // ============================================================

  public async getPedidosPendientes(page: number = 1, limit: number = 10, search: string = ''): Promise<PedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'get',
        url: `${this.apiService.url}pedidos/pendientes`,
        params: { page, limit, search }
      });

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  public async getPedidosEnInventario(page: number = 1, limit: number = 10, search: string = ''): Promise<PedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'get',
        url: `${this.apiService.url}pedidos/inventario`,
        params: { page, limit, search }
      });

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  public async getPedidoById(id: string): Promise<SinglePedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'get',
        url: `${this.apiService.url}pedidos/${id}`
      });

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  public async getPedidoBySku(sku: string): Promise<SinglePedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'get',
        url: `${this.apiService.url}pedidos/sku/${sku}`
      });

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  public async asignarSkuYBatch(
    id: string, 
    data: { sku: string; batchId: string; actualPrice?: number }
  ): Promise<SinglePedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'put',
        url: `${this.apiService.url}pedidos/${id}/asignar-sku-batch`,
        data: data
      });

      this.apiService['normalizeSuccess'](axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  public async crearPedido(pedidoData: any): Promise<SinglePedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'post',
        url: `${this.apiService.url}pedidos`,
        data: pedidoData
      });

      this.apiService['normalizeSuccess'](axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  // ============================================================
  //  ✅ NUEVOS MÉTODOS
  // ============================================================

  /**
   * CAMBIAR ESTADO DE UN PEDIDO
   * PUT /pedidos/:id/cambiar-estado
   */
  public async cambiarEstado(id: string, status: string): Promise<SinglePedidoResponse> {
    try {
      await this.apiService.controltoken();

      const axiosResponse = await this.apiService['axiosClient'].request({
        method: 'put',
        url: `${this.apiService.url}pedidos/${id}/cambiar-estado`,
        data: { status }
      });

      this.apiService['normalizeSuccess'](axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.apiService['normalizeError'](error));
    }
  }

  /**
   * RECHAZAR PEDIDO - Cambia estado a 'rechazado'
   */
  public async rechazarPedido(id: string): Promise<SinglePedidoResponse> {
    return this.cambiarEstado(id, 'rechazado');
  }

  /**
   * INVENTARIAR PEDIDO - Cambia estado a 'inventario'
   */
  public async inventariarPedido(id: string): Promise<SinglePedidoResponse> {
    return this.cambiarEstado(id, 'inventario');
  }
}