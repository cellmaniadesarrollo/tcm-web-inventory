import { Injectable } from '@angular/core';
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorResponse } from 'src/app/models/error.interface';
import { environment } from '../../../environments/environment';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { Router } from '@angular/router';
import { ResponsetokenI } from 'src/app/models/responsetoken.interface';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Injectable({
  providedIn: 'root'
})
export class ApireportsService {
  private socket: any;
 private apiUrl = environment.apiUrl;
  private axiosClient: AxiosInstance; 
  private axiosClient1: AxiosInstance;
  private errorHandler: ErrorHandler;
  url: string = `${this.apiUrl}/` //'http:' + window.location.origin.split(':')[1] + ':4004/'; //'http://192.168.10.251:4003/' //'http://localhost:4003/'; //'http://54.173.37.208/:4004/'//'http://54.159.56.3:4001/';//
  constructor(
    private http: HttpClient,
    errorHandler: ErrorHandler,
    private alerts: AlertsService,
    private router: Router
  ) {
    this.errorHandler = errorHandler;

    this.axiosClient1 = axios.create({
      timeout: 20000,
      headers: {},
    });
    this.axiosClient = axios.create({
      timeout: 9000,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Token'),
        // 'X-Initialized-At': Date.now().toString(),
        'x-user': localStorage.getItem('User'),
        // 'x-rapidapi-key': 'your-rapid-api-key',
      },
    });
  }
  async reload() {
    // console.log(localStorage.getItem('User'))
    this.axiosClient = axios.create({
      timeout: 20000,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Token'),
        // 'X-Initialized-At': Date.now().toString(),
        'x-user': localStorage.getItem('User'),
        // 'x-rapidapi-key': 'your-rapid-api-key',
      },
    });
  }

  private renovaltoken(data: any) {
    const now = new Date();
    if (data.estatustoken) {
      if (data.result) {
        localStorage.setItem('Token', data.result.token);
        localStorage.setItem('User', data.result.user.name_user);
        const grups = data.result.user.user_groups.map(
          (x: any) => x.group.name
        );
        localStorage.setItem('Groups', grups.toString());
        localStorage.setItem('time', `${now}`);
        this.reload();
      }
    }
  }
  private normalizeError(error: any): ErrorResponse {
    Swal.close();
    if (error.response.status == 401) {
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      localStorage.removeItem('Groups');

      this.router.navigate(['login']);
    }
    this.errorHandler.handleError(error);
    this.alerts.showError(error.response.statusText, 'Error');

    return {
      id: '-1',
      code: error.response.status,
      message: error.response.statusText,
    };
  }
  private normalizeSuccess(success: any): ErrorResponse {
    // this.errorHandler.handleError(success);
    this.alerts.showSuccess(success.statusText, success.data);
    // Swal.close();
    //console.log(success.statusText  )
    return {
      id: '-1',
      code: 'error.response.status',
      message: 'error.response.statusText',
    };
  }
  verificarDiferencia(fechaHoraString: any): boolean {
    const fechaHora = new Date(fechaHoraString);
    const fechaActual = new Date();
    const diferencia = fechaActual.getTime() - fechaHora.getTime();
    const diferenciaEnMinutos = Math.abs(diferencia / (1000 * 60));
    return diferenciaEnMinutos > 30;
  }

  public async controltoken(): Promise<ResponsetokenI> {
    try {
      const time = localStorage.getItem('time');
      this.reload();
      if (this.verificarDiferencia(time)) {
        var axiosResponse = await this.axiosClient.request({
          method: 'get',
          url: this.url + 'tokenstate',
        });
        // console.log(axiosResponse.data)
        if (axiosResponse.data.estatustoken) {
          this.renovaltoken(axiosResponse.data);
        }
        return axiosResponse.data;
      } else {
        return { estatustoken: 'true', result: 'any' };
      }
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async getreportsaleslistitems(data: any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
 
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + "listinventorysales",
        data,
      });
      // console.log(axiosResponse.data)
     // this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getitemsinventorys(data: any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
 
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + "listitemsallinventorys",
        data,
      });
      // console.log(axiosResponse.data)
     // this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }


}
