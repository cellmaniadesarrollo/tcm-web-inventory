import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
@Injectable({
  providedIn: 'root'
})
export class CoordinateServiceService {
  private axiosClient = axios.create();
  private ubicacionGuardada: { latitud: number; longitud: number } | null = null;

  constructor() {}

  public async obtenerUbicacion(): Promise<{ latitud: number; longitud: number }> {
    // Si ya la tenemos guardada, la devolvemos directamente
    if (this.ubicacionGuardada) {
      return this.ubicacionGuardada;
    }

    try {
      const ubicacionLocal = await this.ubicacionessucursaleslocal();

      if (ubicacionLocal?.latitude && ubicacionLocal?.longitude) {
        this.ubicacionGuardada = {
          latitud: ubicacionLocal.latitude,
          longitud: ubicacionLocal.longitude
        };
      } else {
        this.ubicacionGuardada = await this.obtenerUbicacionNavegador();
      }
    } catch (error) {
      this.ubicacionGuardada = await this.obtenerUbicacionNavegador();
    }

    return this.ubicacionGuardada;
  }

  private async ubicacionessucursaleslocal(): Promise<any> {
    try {
      const axiosResponse: AxiosResponse = await this.axiosClient.request({
        method: 'get',
        url: 'https://localhost:5001/coords'
      });

      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  private obtenerUbicacionNavegador(): Promise<{ latitud: number; longitud: number }> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitud: position.coords.latitude,
              longitud: position.coords.longitude
            });
          },
          (error) => {
            reject('No se pudo obtener la ubicación: ' + error.message);
          }
        );
      } else {
        reject('La geolocalización no está soportada en este navegador.');
      }
    });
  }

  private normalizeSuccess(response: AxiosResponse): void {
    if (response.status !== 200) {
      throw new Error('Respuesta no exitosa');
    }
  }

  private normalizeError(error: any): string {
    return error?.message || 'Error desconocido al obtener la ubicación local.';
  }
}
