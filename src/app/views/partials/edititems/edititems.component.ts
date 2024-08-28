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
import {
  Listmovementsitem,
  Listincomeshistory,
  ListitemsI,
  ListbrandI,
  ListmodelI,
  ListcolorI,
  ListtypeI,
  ListqualityI,
  ListstateproductI,
  ListsweightI,
  ListsvolumeI,
  ListsstateinventoryI,
  ListscomesfromI,
  Getoneitem,
} from 'src/app/models/item.inteface';

@Component({
  selector: 'app-edititems',
  templateUrl: './edititems.component.html',
  styleUrls: ['./edititems.component.css'],
})
export class EdititemsComponent {
  @Input() iditem: any;
  @Output() closePartialEvent = new EventEmitter<{ reload: any }>();

  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder
  ) {}

  nuevoForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    cod_upc: new FormControl(''),
    name_items: new FormControl(''),
    stock: new FormControl(''),
    id_brand: new FormControl(''),
    id_model: new FormControl(''),
    id_type: new FormControl(''),
    id_color: new FormControl(''),
    id_quality: new FormControl(''),
    id_stateproduct_inventoryflow: new FormControl(''),
    observations: new FormControl(''),
    id_stateinventoryflow: new FormControl(''),
    price: new FormControl(''),
  });
  formChanged = false;
  ngOnInit(): void {
    this.datafind();

  }
  stateinventoryflows: ListsstateinventoryI[] = [];
  submitted = false;

  loading: boolean = true;
  types: ListtypeI[] = [];
  async datafind() {
    this.stateinventoryflows = await this.api.getstateitemper();
    const data: any = await this.api.findoneitem(this.iditem);
    const data1 = await this.api.datanewitem('invfl');
     
    this.types = data1.type;
    this.loading = false;
    this.nuevoForm = this.formBuilder.group({
      _id: [data._id, Validators.required],
      cod_upc: [data.upc, Validators.required],
      name_items: [
        data.items.inventoryfownameitem.name_nameitems,
        Validators.required,
      ],
      stock: [data.stockinventoryflow.stock, Validators.required],
      id_brand: [data.items.model.brand.name_brands],
      id_model: [data.items.model.business_model, Validators.required],
      id_type: [data.typeinventoryflow._id, Validators.required],
      id_color: [data.items.colors.color_name, Validators.required],
      id_quality: [
        data.items.quality.quality_inventoryflow,
        Validators.required,
      ],
      id_stateproduct_inventoryflow: [
        data.stateproductinventoryflow.stateproduct_inventoryflow,
        Validators.required,
      ],
      observations: [data.observations],
      id_stateinventoryflow: [data.id_state, Validators.required],
      price: [data.items.item_price],
    });
    this.nuevoForm.valueChanges.subscribe(() => {
      this.formChanged = true;
    });
  }

  async onSubmitclose() {   
    if (this.nuevoForm.invalid) { 
      return;
    } else {
      if (this.formChanged) {
         
        const data = await this.api.dataedititem(this.nuevoForm.value);
       
        if (data == 'OK') {
          this.closePartialEvent.emit({ reload: true });
        }
      } else {
        this.closePartialEvent.emit({reload:false}) 
      }
    }
  }

  cancel() {
    this.closePartialEvent.emit({ reload: false });
  }
  onFocus(event: any) {
    event.target.select();
  }
}
