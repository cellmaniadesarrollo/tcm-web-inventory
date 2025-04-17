import { Injectable, ErrorHandler } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Router } from '@angular/router';
import { AlertsService } from 'src/app/alerts/alerts.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AxiosInterceptorService {
  private axiosClient: AxiosInstance;

  constructor(
    private router: Router,
    private alerts: AlertsService,
    private errorHandler: ErrorHandler
  ) {
    this.axiosClient = this.createAxiosClient();
  }

  private createAxiosClient(): AxiosInstance {
    const token = localStorage.getItem('Token');
    const user = localStorage.getItem('User');

    const client = axios.create({
      timeout: 150000,
      headers: {
        Authorization: `Bearer ${token}`,
        'x-user': user || '',
      },
    });

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        Swal.close();
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('Token');
          localStorage.removeItem('User');
          localStorage.removeItem('Groups');
          this.router.navigate(['/login']);
        }

        this.alerts.showError(
          error.response?.statusText || 'Error desconocido',
          'Error'
        );
        this.errorHandler.handleError(error);
        return Promise.reject(error);
      }
    );

    return client;
  }

  reload(): void {
    this.axiosClient = this.createAxiosClient();
  }

  // Métodos directos
  get<T = any>(url: string, config?: any) {
    return this.axiosClient.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.axiosClient.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.axiosClient.put<T>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.axiosClient.delete<T>(url, config);
  }
}
