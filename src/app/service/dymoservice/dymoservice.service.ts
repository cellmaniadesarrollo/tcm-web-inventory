import { Injectable } from '@angular/core';
 import { environment } from '../../../environments/environment';
 import axios from 'axios';
@Injectable({
  providedIn: 'root'
})
export class DymoserviceService {
  private apiUrl = environment.apidymo;

  constructor() { }

  async printTickets(data: any): Promise<any> {
    try { 
      const response = await axios.post(`${this.apiUrl}/api/printtikets`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
 
      throw error;
    }
  }
}
