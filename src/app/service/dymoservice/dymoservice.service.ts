import { Injectable } from '@angular/core';
 import { environment } from '../../../environments/environment';
 import axios from 'axios';
 import { AlertsService } from 'src/app/alerts/alerts.service';
@Injectable({
  providedIn: 'root'
})
export class DymoserviceService {
  private apiUrl = environment.apidymo;

  constructor(private alerts: AlertsService) { }

  async printTickets(data: any): Promise<any> {
    try { 
      const response = await axios.post(`${this.apiUrl}/api/printtiketsss`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      this.alerts.showSuccess( "Impresion ticket con exito", "Exito");
      return response.data;
    } catch (error) {
      console.log(error)
 this.alerts.showError('No se Pudo imprimir ticket', 'Error Impresion',0);
      throw error;
    }
  }
}
