import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Renderer2 } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import {
  TechnicianeMoveI,
  MovementnameI,
  UsersMoveI,
} from 'src/app/models/movements.interface';
import { v4 as uuidv4 } from 'uuid';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-outs',
  templateUrl: './outs.component.html',
  styleUrls: ['./outs.component.css'],
})
export class OutsComponent {
  @Input() iditem: any;
  constructor(
    // private activerouter: ActivatedRoute,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private api: ApiService,
    // private router: Router,
    // private tokenstate: TokencheckService,
    // public readonly swalTargets: SwalPortalTargets,
    private formBuilder: FormBuilder
  ) {}
  salidaForm: FormGroup = new FormGroup({
    id_item: new FormControl(''),
    codigo_movimiento: new FormControl(''),
    tipo_salida: new FormControl(null),
    numero_orden: new FormControl(''),
    cantidad: new FormControl(''),
    entrega_a: new FormControl(null),
    observaciones: new FormControl(''),
    fecha: new FormControl(new Date()),
  });
  submittedoutmovement = false;
  get f1(): { [key: string]: AbstractControl } {
    return this.salidaForm.controls;
  }

  ngOnInit(): void {
    //console.log(this.iditem)
    this.listdataout();
  }

  find = '';
  codeauto = false;
  save = '';
  printt = '';
  technician: TechnicianeMoveI[] = []; // TechnicianeMoveI[] = [];
  outs: MovementnameI[] = [];
  focus = false;
  showModalBox: boolean = false;
  maxvalue: String = '';
  minvalue: String = '1';
  async imputremplace(value: any) {
    this.save = this.save.replace(/null| /gi, '') + value.data;
    if (this.save.length == 36) {
      this.printt = this.save;
      this.salidaForm.controls['codigo_movimiento'].setValue(
        this.printt.replaceAll("'", '-')
      );
      this.save = '';
      this.renderer.selectRootElement('#myInput2').focus();
    } else {
      this.salidaForm.controls['codigo_movimiento'].setValue('');
    }

    await this.delay(200);
    if (this.save.length != 36) {
      this.save = '';
    }
  }
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async changeLeagueOwnertype(e: any) {
    this.technician  = await this.api.findmovemenusers({idmovement:e,idinventory:this.idinventorys});
    // const as = await this.api.liststaffmovementtype(e);
    // //console.log(as)
    // this.technician = as;
    // const found = this.outs.find((element: any) => element._id == e);
    // if (
    //   found?.name_movement == 'REPARACION DAÑO' ||
    //   found?.name_movement == 'REPARACION'
    // ) {
    //   this.codeauto = false;
    // } else {
    //   this.salidaForm.controls['numero_orden'].setValue('');
    //   this.codeauto = true;
    // }
  }
idinventorys:string=''
  async listdataout() {
    const data = await this.api.movementoutdatafind({id:this.iditem});
    this.idinventorys=data.idinventory;
    //console.log(data);
    //const data = await this.api.movementoutdatafind({id:this.iditem});

    // this.technician = data.item;
      this.outs = data.outs;
      console.log(this.outs)
      const findmovement = this.outs.find(elemento => elemento.name_movement== 'VENTA');
      this.technician  = await this.api.findmovemenusers({idmovement:findmovement?._id,idinventory:this.idinventorys});

    const currentDateAndTime = this.datePipe.transform(
      new Date(),
      "yyyy-MM-dd'T'HH:mm:ss"
    );
    const uuid = uuidv4();
    //console.log(uuid)
    // console.log(currentDateAndTime)
    this.salidaForm.setValue({
      id_item: this.iditem,
      codigo_movimiento: uuid,
      tipo_salida: findmovement?._id,
      numero_orden: '',
      cantidad: this.functionvalue(this.maxvalue),
      entrega_a: null,
      observaciones: '',
      fecha: currentDateAndTime,
    });
  }
  functionvalue(data: any) {
    if (data == 0) {
      this.minvalue = '0';
      return 0;
    } else {
      this.minvalue = '1';
      return 1;
    }
  }
  async saveoutmovement() {
    // console.log(this.salidaForm.value.numero_orden)
 
      //   ;
     this.submittedoutmovement = true;
     if (this.salidaForm.invalid) {
       // console.log(JSON.stringify(this.salidaForm.value, null, 2));
       return;
     } else { 
       const data = await this.api.movementoutsave(this.salidaForm.value);
       if (data == 'OK') { 
         this.find = '';
         this.submittedoutmovement = false;
       } 
     }
   }
}
