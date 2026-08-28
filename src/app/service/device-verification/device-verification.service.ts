// services/device-verification/device-verification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceVerificationService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // ============================================
  // ✅ DESGUACE - VERIFICACIONES DE PARTES
  // ============================================

  getScrapVerifications(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    const url = `${this.baseUrl}/device-verification/scrap`;
    console.log('📤 [DeviceVerificationService] getScrapVerifications:', url);
    return this.http.get<any>(url, { params: httpParams });
  }

  getScrapStats(): Observable<any> {
    const url = `${this.baseUrl}/device-verification/scrap/stats`;
    console.log('📤 [DeviceVerificationService] getScrapStats:', url);
    return this.http.get<any>(url);
  }

  getById(id: string): Observable<any> {
    const url = `${this.baseUrl}/device-verification/scrap/${id}`;
    console.log('📤 [DeviceVerificationService] getById:', url);
    return this.http.get<any>(url);
  }

  // ✅ NUEVOS MÉTODOS PARA BATCH

  /**
   * Obtiene todos los batches con verificaciones
   * GET /api/device-verification/batches
   */
  getBatchesWithVerifications(): Observable<any> {
    const url = `${this.baseUrl}/device-verification/batches`;
    console.log('📤 [DeviceVerificationService] getBatchesWithVerifications:', url);
    return this.http.get<any>(url);
  }

  /**
   * Obtiene un batch con sus verificaciones
   * GET /api/device-verification/batch/:batchId
   */
  getBatchWithVerifications(batchId: string): Observable<any> {
    const url = `${this.baseUrl}/device-verification/batch/${batchId}`;
    console.log('📤 [DeviceVerificationService] getBatchWithVerifications:', url);
    return this.http.get<any>(url);
  }

  /**
   * Obtiene las partes (BUENA/MALA) de un batch
   * GET /api/device-verification/batch/:batchId/parts
   */
  getPartsByBatch(batchId: string): Observable<any> {
    const url = `${this.baseUrl}/device-verification/batch/${batchId}/parts`;
    console.log('📤 [DeviceVerificationService] getPartsByBatch:', url);
    return this.http.get<any>(url);
  }

  // Métodos legacy (compatibilidad)
  getByBatchId(batchId: string): Observable<any> {
    return this.getBatchWithVerifications(batchId);
  }

  getByOrderId(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/device-verification/order/${orderId}`;
    console.log('📤 [DeviceVerificationService] getByOrderId:', url);
    return this.http.get<any>(url);
  }
}