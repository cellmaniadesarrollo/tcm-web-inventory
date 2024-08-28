import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ListbrandI } from 'src/app/models/item.inteface';
@Component({
  selector: 'app-createmodel',
  templateUrl: './createmodel.component.html',
  styleUrls: ['./createmodel.component.css'],
})
export class CreatemodelComponent {
  @Input() inventory:any;
  @Output() closeModalEvent = new EventEmitter<{ data: any }>(); 
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  closeModal(data: any, close: boolean) {
    const datos = { data: data, close: close };
    this.closeModalEvent.emit({ data: datos });
  }
  brands: ListbrandI[] = [];
  displayDialog: boolean = false;
  ngOnInit(): void {
    this.validationsname();
    this.showDialog();
    this.listbrands();
  }

  async listbrands() {
    this.brands = await this.api.listbrands();
  }

  showDialog() {
    this.displayDialog = true;
  }
  modelform: FormGroup = new FormGroup({
    business_model: new FormControl(''),
    technical_model: new FormControl(''),
    year_model: new FormControl(''),
    id_brands: new FormControl(null),
  });
  validationsname() {
    this.modelform = this.formBuilder.group({
      business_model: ['', Validators.required],
      technical_model: ['', Validators.required],
      year_model: ['', Validators.required],
      id_brands: [null, Validators.required],
    });
  }
  submitted = false;
  async onSubmitclose() { 
    this.submitted = true;
    if (this.modelform.valid) {
      const data = await this.api.datanewmodel(this.modelform.value,this.inventory);
      if (data) {
        this.closeModal(data, true);
      }
    }
  }
  async onSubmit() { 
    this.submitted = true;
    if (this.modelform.valid) { 
      const data = await this.api.datanewmodel(this.modelform.value,this.inventory);
      if (data) { 
        this.validationsname();
        this.closeModal(data, false);
        this.searchTerm=''
        this.submitted = false;
      }
    }
  }
  mostrarSugerencias2 = false;
  onInputFocus(data: string) {
    switch (data) {
      case 'id_brands':
        this.mostrarSugerencias2 = true;
        break;

      default:
        break;
    }
  }

  onInputBlur(data: string) {
    if (this.mostrarSugerencias2)
      setTimeout(() => {
        switch (data) {
          case 'id_brands':
            this.mostrarSugerencias2 = false;
            break;
          default:
            break;
        }

        console.log('Input fuera de foco');
      }, 200);
  }

  seleccionarSugerencia(sugerencia: string, id: string, input: string) {
    this.cambios(sugerencia, input, id);
  }
  onInputChange(dat: any) {
    this.cambios(null, dat, '');
  }
  cambios(dat: any, cambio: any, id: string) {
    if (this.modelform.controls[cambio].getRawValue() != null && dat == null) {
      this.cambios1('', cambio);
      this.modelform.controls[cambio].setValue(null);
    } else if (id != '') {
      this.cambios1(dat, cambio);
      this.modelform.controls[cambio].setValue(id);
    }
  }
  searchTerm: string = '';
  cambios1(dat: any, cambio: any) {
    switch (cambio) {
      case 'id_brands':
        this.searchTerm = dat;
        break;

      default:
        break;
    }
  }
  modalVisible1: boolean = false;
  openModalbrand() { 
    this.modalVisible1 = true;
  }
  closeModalbrand(event: { data: any }) {
    if (event.data.close) {
      this.modalVisible1 = false;
    }
    if (event.data.data.id) {
      this.seleccionarSugerencia(
        event.data.data.name,
        event.data.data.id,
        'id_brands'
      );
    }
  }
}
