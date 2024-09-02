import { Component } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import { LoginI } from 'src/app/models/login.interface';
import { Router } from '@angular/router';
import { ResponseI } from 'src/app/models/response.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertsService } from 'src/app/alerts/alerts.service';
import { VglobalService } from 'src/app/service/vglobal/vglobal.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    name_user: new FormControl('', Validators.required),
    pasword_user: new FormControl('', Validators.required),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private alerts: AlertsService,
    private global: VglobalService
  ) {}
  errorStatus: boolean = false;
  erroMsj: any = '';
  ngOnInit(): void {
    // console.log('dataResponse')
  }
  nivel2 = false;
  nivel1=false;
  async onLogin(form: LoginI) {
   
    const dataResponse: ResponseI = await this.api.LoginByEmail(form);
    const now = new Date();
    if (dataResponse) {
      this.alerts.showSuccess('Bienvenido', dataResponse.user.name_user);
      localStorage.setItem('Token', dataResponse.token);
      localStorage.setItem('User', dataResponse.user.name_user); 
      localStorage.setItem('time', `${now}`); 
      if(dataResponse.user.img){
      localStorage.setItem('Userimg', 'data:image/jpeg;base64,'+dataResponse.user.img);}else{
        localStorage.setItem('Userimg', dataResponse.user.img)
      }
      const grups = dataResponse.user.user_groups.map((x: any) => x.group.name);
      localStorage.setItem('Groups', grups.toString());
      this.nivel2 = grups.some((x: any) => x == 'IFE' || x == 'ADMINS');
      this.nivel1=  grups.some((x:any) => x == 'CSRS' || x == 'ADMINS')
      await this.api.reload();
      if (this.nivel2&&this.nivel1) {
        this.router.navigate(['dashboard']);  
      } else {
        this.router.navigate(['income']);
      }
    }
  }

  fieldTextType: boolean = false;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
