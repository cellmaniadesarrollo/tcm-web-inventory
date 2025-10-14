import { Injectable } from '@angular/core';
import { AxiosInterceptorService } from '../axios-interceptor/axios-interceptor.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReportsCelularesService {
 constructor(private axiosService:AxiosInterceptorService ) { }
   private url = environment.apiUrl;
   
   public async getReportStockCelulares(): Promise<any> {
     try {
       const response = await this.axiosService.get(this.url + "/reports-celulares" );
       return response.data;
     } catch (error) {
       return Promise.reject(error);
     }
   }
    
 async getReportCelularesVendidos(data:any) : Promise<any> {
     try {
       const response = await this.axiosService.post(this.url + "/reports-celulares-sales",data );
       return response.data;
     } catch (error) {
       return Promise.reject(error);
     }
   }
 
}

 
