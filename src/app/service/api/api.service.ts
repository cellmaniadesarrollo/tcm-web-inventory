import { Injectable, ViewChild } from '@angular/core';
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { ErrorHandler } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorResponse } from 'src/app/models/error.interface';
import { LoginI } from '../../models/login.interface';
import { ResponseI } from '../../models/response.interface';
import { Router } from '@angular/router';
import { ResponsetokenI } from 'src/app/models/responsetoken.interface';
import { AlertsService } from 'src/app/alerts/alerts.service';
import {
  ListnewdataI,
  ListmodelI,
  ListbrandI,
} from 'src/app/models/item.inteface';
import {
  ListitemsIN,
  Getimgbase64,
  Getpdfbase64,
  Getxmlticket,
  Getoneitem,
} from 'src/app/models/item.inteface';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  ListmovementsIN,
  MovementsI,
} from 'src/app/models/movements.interface';
import { ListincomesIN } from 'src/app/models/income.inteface';
import { ListsupliersI } from 'src/app/models/supliers.interface';
import { link } from 'fs'; 
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private socket: any;
  private apiUrl = environment.apiUrl;
  private axiosClient: AxiosInstance; 
  private axiosClient1: AxiosInstance;
  private errorHandler: ErrorHandler;
  url: string =  'http:' + window.location.origin.split(':')[1] + ':4004/'; //'http://192.168.10.251:4003/' //'http://localhost:4003/'; //'http://54.173.37.208/:4004/'//'http://54.159.56.3:4001/';//
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

  public async LoginByEmail(from: LoginI): Promise<ResponseI> {
    try {
      console.log(this.url,environment)
      var axiosResponse = await this.axiosClient1.request({
        method: 'post',
        url: this.url + 'login',
        data: from,
      }); 
      
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error)); 
    }
  }
  public async datanewmarca(data: any, inventory: any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
      switch (inventory) {
        case 'invper':
          linkdata = 'brandnewper';
          break;
        case 'invfl':
          linkdata = 'brandnew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + linkdata,
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async datanewmodel(data: any, inventory: any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
      switch (inventory) {
        case 'invper':
          linkdata = 'modelnewper';
          break;
        case 'invfl':
          linkdata = 'modelnew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'modelnew',
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async datanewnameitem(data: any, inventory: any): Promise<any> {
    try {
      var linkdata: string = '';
      await this.controltoken();

      switch (inventory) {
        case 'invper':
          linkdata = 'nameiteminventarionewper';
          break;
        case 'invfl':
          linkdata = 'nameiteminventarionew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + linkdata,
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async datanewcolor(data: any,inventory:any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
      switch (inventory) {
        case 'invper':
          linkdata = 'colornewper';
          break;
        case 'invfl':
          linkdata = 'colornew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + linkdata,
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async datanewtype(data: any, inventory: any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
      switch (inventory) {
        case 'invper':
          linkdata = 'tipoinventarionewper';
          break;
        case 'invfl':
          linkdata = 'tipoinventarionew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + linkdata,
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async datanewquality(data: any,inventory:any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
      switch (inventory) {
        case 'invper':
          linkdata = 'qualityinventarionewper';
          break;
        case 'invfl':
          linkdata = 'qualityinventarionew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + linkdata,
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async datanewstateproduct(data: any,inventory:any): Promise<any> {
    try {
      await this.controltoken();
      var linkdata: string = '';
      switch (inventory) {
        case 'invper':
          linkdata = 'stateproductinventarionewper';
          break;
        case 'invfl':
          linkdata = 'stateproductinventarionew';
          break;

        default:
          return;
      }
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + linkdata,
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async datanewcomesfrom(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'comesfrominventarionew',
        data,
      });
      // console.log(axiosResponse.data)
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async listbrands(): Promise<ListbrandI[]> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'listbrands',
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listmodels(data: any): Promise<ListmodelI[]> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'getmodel',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async listmodelsfind(data: any): Promise<ListmodelI[]> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'getmodelfind',
        params: {
          _id: data.id,
          findm: data.find,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async datanewitem(data: string): Promise<ListnewdataI> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'ivfnewdata',
        params: {
          url: data,
        },
      });
      // this.normalizeSuccess(axiosResponse);
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async dataedititem(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'editoneitem',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async savenewitem(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'ivfnew',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async listitems(data: any): Promise<ListitemsIN> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'listitemsinventarionew',
        params: {
          allclients: data.allclients,
          numperpage: data.numperpage,
          pagination: data.pagination,
          findlike: data.findlike,
        },
      });
      // console.log(axiosResponse.data)

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getimgbase64(data: any): Promise<Getimgbase64> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'imgticket',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getimgunicbase64(data: any): Promise<Getimgbase64> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'imgunicticket',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async getpdfbase64(data: any): Promise<Getpdfbase64> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'pdfticket',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async findoneitem(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'finditem',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listhistoryitems(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'historyitem',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listincomeshistory(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomeshistory',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  /**
   *
   * movements
   */

  public async movementoutdata(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementoutdata',
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async movementoutdatafind(data:any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'movementfindoutdata',
        data
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async findmovemenusers(data:any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'typemovementusers',
        data
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async movementgetcodes(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementgetcodesuid',
        timeout: 20000,
      });
      //console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async movementoutsave(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'movementoutsave',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async liststaffmovementtype(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementypeoutget',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listmovements(data: any): Promise<ListmovementsIN> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementgetlist',
        params: {
          allclients: data.allclients,
          alltypes: data.alltypes,
          numperpage: data.numperpage,
          pagination: data.pagination,
          findlike: data.findlike,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async movementyepesmovements(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementgettypes',
        params: {
          id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async movementyepestypemovements(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementgettypestype',
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async movementgetonemovement(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementgetone',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getonemovementdetaildata(data: any): Promise<MovementsI> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementdetaildata',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getonemovementeditdata(data: any): Promise<MovementsI> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'movementeditdata',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async movementeditsave(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'movementeditone',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async movementreturnsave(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'movementreturn',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async reportmovements(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'reportmovements',
        params: {
          data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  /**
   *
   * Dashboard
   */
  public async dashboardata(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'dashboardinfo',
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getreportstockout(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'getreportstockout',
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  /**
   * ingresos
   *
   */
  public async getfindedititemincome(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'finditemseditincome',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async getfindpercentaje(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'findpercentajename',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async finditemincome(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'finditemsincome',
        params: {
          id: data,
        },
      }); 
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getdataincome(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesvedata',
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getdatanewsupplier(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesdatanewsupplier',
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async saveincome(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'incomessave',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async editincome(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'incomesedit',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async listincomesstart(data: any): Promise<ListincomesIN> { 
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomeslistife',
        params: data,
      });
      // console.log(axiosResponse.data)

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listincomes(data: any): Promise<ListincomesIN> { 
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomeslistifefilter',
        params: data,
      });
      // console.log(axiosResponse.data)

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listincomesCSRS(data: any): Promise<ListincomesIN> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomeslistCSRS',
        params: {
          allclients: data.allclients,
          numperpage: data.numperpage,
          pagination: data.pagination,
          findlike: data.findlike,
        },
      });
      // console.log(axiosResponse.data)

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async savesuppliersincome(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'incomesdatanewsuppliersave',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async reportincomedoument(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesreportsdocument',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async reportincomedoumentcomplete(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesreportscomnpletedocument',
        params: {
          id: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async incomeapproved(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesapproved',
        params: {
          id: data,
        },
      });
      console.log(axiosResponse);
      // this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async incomedesapproved(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesdisapproved',
        params: {
          id: data,
        },
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async reportincomedatewassap(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'incomesreportsdatewassap',
        params: {
          data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async reportnamevalue(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'reportnamesvalues',
        params: {
          data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async reportnewvalue(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'reportnewvalues',
        params: data, 
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async ticketsincomes(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'tiketsincomes',
        data,
      });
      // this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async findinventoryitem(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'findinventoryitems',
        data,
      });
      // this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getlisinventorys( ): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'listinventorysnames', 
      });
      // this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  /**
   *
   * Inventario personalizados
   *
   */
  public async getnewdatainvantoryrep(data: string): Promise<ListnewdataI> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'ivpernewdata',
        params: {
          url: data,
        },
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async findnameinvantoryrep(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'ivperfindname',
        data,
      });
      return axiosResponse.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async savenewitemper(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'ivpernew',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async listitemsper(data: any): Promise<ListitemsIN> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'listitemsinventarioper',
        params: {
          allclients: data.allclients,
          numperpage: data.numperpage,
          pagination: data.pagination,
          findlike: data.findlike,
        },
      });
      // console.log(axiosResponse.data)

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getpdfbase64per(data: any): Promise<Getpdfbase64> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'pdfticketper',
        params: data,
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async getstateitemper(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'getstateitemper',
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  /**
   *
   * xml ticket
   *
   */

  public async getxmlticket(data: any): Promise<Getxmlticket> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'xmlticket',
        params: {
          _id: data,
        },
      });
      // console.log(axiosResponse.data)
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  public async printticketlocal(data: any): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: `http://192.168.10.250:5000/api/printtikets`, //
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  /**
   *
   * user details
   *
   */
  public async getuserdetails(): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'userdetails',
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  public async userdetailsedit(data: any): Promise<any> {
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'post',
        url: this.url + 'userdetailsedit',
        data,
      });
      this.normalizeSuccess(axiosResponse);
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
  /**
   * SUPPLIERS
   */
  public async listsuppliers(data: any): Promise<ListsupliersI> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'listsuppliers',
        params: {
          allclients: data.allclients,
          numperpage: data.numperpage,
          pagination: data.pagination,
          findlike: data.findlike,
        },
      });
      // console.log(axiosResponse.data)

      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }

  /**
   * RELOADS
   */
  public async reloaddata(): Promise<any> {
    //console.log(data);
    try {
      await this.controltoken();
      var axiosResponse = await this.axiosClient.request({
        method: 'get',
        url: this.url + 'collectionName',
      });
      return axiosResponse.data;
    } catch (error) {
      return Promise.reject(this.normalizeError(error));
    }
  }
}
