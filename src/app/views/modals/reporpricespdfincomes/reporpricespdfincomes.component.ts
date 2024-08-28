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
import { PdfViewerService } from 'src/app/service/pdf-viewer/pdf-viewer.service';
@Component({
  selector: 'app-reporpricespdfincomes',
  templateUrl: './reporpricespdfincomes.component.html',
  styleUrls: ['./reporpricespdfincomes.component.css']
})
export class ReporpricespdfincomesComponent {
  @Output() closeModalEvent = new EventEmitter<any>();
  constructor(
    private api: ApiService,
    private pdfViewerService: PdfViewerService,
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
   async  getreport(data: any) {
    const dat = await this.api.reportnewvalue(data);
    this.pdfViewerService.openPDFInNewTab(dat);
     this.closeModal()
  } 
  closeModal() {
    this.closeModalEvent.emit();
  }
}
