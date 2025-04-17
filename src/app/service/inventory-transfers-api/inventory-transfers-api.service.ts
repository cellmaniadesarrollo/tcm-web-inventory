import { Injectable } from '@angular/core';
import { AxiosInterceptorService } from '../axios-interceptor/axios-interceptor.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InventoryTransfersApiService {

  constructor(private axiosService:AxiosInterceptorService ) { }
  private url = environment.apiUrl;
  
  public async getnewdata(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/newdata",data);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async finditem(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/finditem",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async destinationstock(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/destination-stock",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async saveitem(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/save",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async listitem(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/listitems",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async incomelistitem(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/incomelistitem",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async incomeacept(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/incomeacept",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  public async incomedecline(data:any): Promise<any> {
    try {
      const response = await this.axiosService.post(this.url + "/inventorytransfer/incomedeclined",data); 
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
