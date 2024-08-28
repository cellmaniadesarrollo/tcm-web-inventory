import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../../service/api/api.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ListinventorysnamesI } from 'src/app/models/income.inteface';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-reportwassapincomes',
  templateUrl: './reportwassapincomes.component.html',
  styleUrls: ['./reportwassapincomes.component.css']
})
export class ReportwassapincomesComponent {
  @Output() closeModalEvent = new EventEmitter<any>();
  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder
  ) { }
  namesinventory :ListinventorysnamesI[]=[]
  displayDialog: boolean = false;
  dateform: FormGroup = new FormGroup({
    inventoryname:new FormControl(''),
    datestart: new FormControl(''),
    dateend: new FormControl(''),
  });
  ngOnInit(): void {
    this.getnamesinventory()

  }
  showDialog() {
    const currentDate = new Date();
    this.dateform = this.formBuilder.group({
      inventoryname:[this.findinitinventory(),
        Validators.required,
      ],
      datestart: [
        formatDate(currentDate, 'yyyy-MM-dd', 'en-US'),
        Validators.required,
      ],
      dateend: [
        formatDate(currentDate, 'yyyy-MM-dd', 'en-US'),
        Validators.required,
      ],
    });
    this.displayDialog = true;
  }
  async getnamesinventory() {
    const data = await this.api.getlisinventorys()
    this.namesinventory=data
     
    this.showDialog();
  }
  findinitinventory(){
   
   const find= this.namesinventory.find((element) => element.inventory_name == "INVENTORYFLOW"); 
    return find?._id
  }
  async wassapgetreport(data: any) {
    const currentDate = new Date();
    var wassapstring: String = '';
    const dataget = await this.api.reportincomedatewassap(data); 
    if (dataget.length > 0) { 
      window.open(
        'https://api.whatsapp.com/send?text=' +  dataget,
        '_blank'
      );
    }
  }
  closeModal() {
    this.closeModalEvent.emit();
  }
}
