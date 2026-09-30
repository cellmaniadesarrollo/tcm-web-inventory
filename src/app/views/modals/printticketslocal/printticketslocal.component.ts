import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { DymoserviceService } from 'src/app/service/dymoservice/dymoservice.service';
// Arriba del archivo (solo para la implementación temporal):

// ajusta la ruta a tu proyecto
@Component({
  selector: 'app-printticketslocal',
  templateUrl: './printticketslocal.component.html',
  styleUrls: ['./printticketslocal.component.css']
})
export class PrintticketslocalComponent {
  @Input() printtype: any
  @Input() namet1: any;
  @Input() namet2: any;
  @Input() nameb: any;
  @Input() can: any;
  @Input() qrdata: any;
  @Input() price: any;
  @Input() f: any;
  @Input() ivsa: boolean = false;
  @Input() showiva: boolean = false
  @Output() closeModalEvent = new EventEmitter<any>();
  constructor(
    private api: ApiService,
    private activerouter: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private apidymo: DymoserviceService
  ) { }
  closeModal() {
    this.closeModalEvent.emit();
  }
  errorimpresion: boolean = false;
  displayDialog: boolean = false;
  ngOnInit(): void {
    this.validationsname();
    this.showDialog();
  }
  showDialog() {

    this.displayDialog = true;
  }
  printform: FormGroup = new FormGroup({
    topText1: new FormControl(''),
    topText2: new FormControl(''),
    bottomText1: new FormControl(''),
    cant: new FormControl(''),
    qrText: new FormControl(''),
    price: new FormControl(null),
    iva: new FormControl(false),
    f: new FormControl(''),
  });
  validationsname() {
    this.printform = this.formBuilder.group({
      topText1: [this.namet1, Validators.required],
      topText2: [this.namet2, Validators.required],
      bottomText1: [this.nameb, Validators.required],
      cant: [this.can, [Validators.required, Validators.min(1)]],
      qrText: [this.qrdata, Validators.required],
      price: [this.price, Validators.required],
      iva: [this.ivsa],
      f: [this.f],
    });
  }
  submitted = false;
  loading = false;
  successimpresion: boolean = false;
  mensajeimpresion: string = '';
  async onSubmit() {
    this.submitted = true;
    if (this.printform.valid) {
      this.loading = true;
      this.errorimpresion = false;
      this.successimpresion = false;
      this.mensajeimpresion = '';

      if (this.printtype === 'dymo') {
        try {
          await this.apidymo.printTickets(this.printform.value)
        } catch (error) {
          this.errorimpresion = true
          this.mensajeimpresion = 'No se pudo realizar la impresión. Intente nuevamente.';
          this.loading = false
          return
        }

        //console.log(data)
      } else {

        // ===================== ORIGINAL (red local) =====================
        // Para volver a lo anterior: descomenta este bloque y borra el bloque TEMPORAL.
        // const params = new URLSearchParams(this.printform.value)
        // const url = `http://192.168.10.250:5000/api/printtikets?${params.toString()}`;// `http://localhost:5000/api/printtikets?${params.toString()}`;//`https://82d3-186-69-248-234.ngrok-free.app/api/printtikets?${params.toString()}`;//
        // window.open(url, '_blank');
        // ================================================================

        // ===================== TEMPORAL (servidor expuesto) =====================
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
          const params = new URLSearchParams({
            ...this.printform.value,
            key: '0dcb738447c888755bb9f58733771ef92be7fb368bf45c42'// token que validará nginx
          });
          const url = `https://etiquetas.teamcellmania.com/api/printtikets?${params.toString()}`;

          const res = await fetch(url, {
            headers: { Accept: 'application/json' },
            signal: controller.signal
          });

          if (!res.ok) {
            if (res.status === 403) throw new Error('Acceso denegado (token inválido).');
            if (res.status === 502 || res.status === 504) throw new Error('El servidor de impresión no responde.');
            throw new Error('No se pudo realizar la impresión.');
          }

          const data = await res.json();
          if (!data.ok) throw new Error(data.message || 'No se pudo realizar la impresión.');

          // Éxito: mostrar confirmación un momento y cerrar el modal
          this.loading = false;
          this.successimpresion = true;
          this.mensajeimpresion = data.message || 'Etiqueta impresa con éxito.';
          setTimeout(() => this.closeModal(), 1500);
          return;
        } catch (error: any) {
          console.log(error);
          this.loading = false;
          this.errorimpresion = true;
          this.mensajeimpresion = error?.name === 'AbortError'
            ? 'Tiempo de espera agotado. Intente nuevamente.'
            : (error?.message || 'No se pudo realizar la impresión. Intente nuevamente.');
          return;
        } finally {
          clearTimeout(timeout);
        }
        // =======================================================================
      }

      this.loading = false;
      this.closeModal()
    }
  }


  get numero() {
    return this.printform.get('id');
  }
  onInputChange(event: any) {
    const input = event.target.value;
    if (input < 0 || input === '') {
      this.numero?.setValue('');
    }
  }
  onFocus(event: any) {
    event.target.select();
  }
  getPrecioConIva(): number {
    const price = this.printform.get('price')?.value || 0;
    const conIva = this.printform.get('iva')?.value;

    if (!conIva) {
      return price;
    } else {
      return price * 1.15; // suma el 15%
    }
  }

}
