import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule,routingComponents  } from './app-routing.module';
import { AppComponent } from './app.component'; 


import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { HeaderComponent } from './views/templates/header/header.component';
import { FooterComponent } from './views/templates/footer/footer.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgToastModule } from 'ng-angular-popup'
import {NgbModule,NgbModalModule} from '@ng-bootstrap/ng-bootstrap'; 
import { DatePipe } from '@angular/common';
import { SidebarComponent } from './views/templates/sidebar/sidebar.component'; 
 
 
 
 
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CreatenameitemsComponent } from './views/modals/createnameitems/createnameitems.component';
import { CreatebrandComponent } from './views/modals/createbrand/createbrand.component';
import { CreatemodelComponent } from './views/modals/createmodel/createmodel.component';
import { CreatetypeComponent } from './views/modals/createtype/createtype.component';
import { CreatecolorComponent } from './views/modals/createcolor/createcolor.component';
import { CreatequalityComponent } from './views/modals/createquality/createquality.component';
import { CreatestateiteminventoryComponent } from './views/modals/createstateiteminventory/createstateiteminventory.component';
import { PrinttiketsitemsComponent } from './views/modals/printtiketsitems/printtiketsitems.component';
import { OptionsitemsComponent } from './views/modals/optionsitems/optionsitems.component';
import { EdititemsComponent } from './views/partials/edititems/edititems.component';
import { DevelopmentComponent } from './views/partials/development/development.component';
import { OutsComponent } from './views/partials/outs/outs.component';
import { PrintticketslocalComponent } from './views/modals/printticketslocal/printticketslocal.component';
import { TablemovementsComponent } from './views/partials/tablemovements/tablemovements.component';
import { ReloadComponent } from './views/partials/reload/reload.component';
import { ReportwassapincomesComponent } from './views/modals/reportwassapincomes/reportwassapincomes.component';
import { ReporpricespdfincomesComponent } from './views/modals/reporpricespdfincomes/reporpricespdfincomes.component';
import { TableincomerepComponent } from './views/partials/tableincomerep/tableincomerep.component'; 

 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { IncomeperComponent } from './views/incomeper/incomeper.component';
import { InventorysalesComponent } from './views/inventorysales/inventorysales.component';
import { InventorysalesnewComponent } from './views/inventorysales/inventorysalesnew/inventorysalesnew.component';
import { MovementssalesComponent } from './views/movementssales/movementssales.component';

 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'; 
import { MatExpansionModule } from '@angular/material/expansion';  
import { MatMenuModule } from '@angular/material/menu';
import { TicketPrinterComponent } from './views/ticket-printer/ticket-printer.component'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IncomesalesComponent } from './views/incomesales/incomesales.component';
import { OutgoingTransfersComponent } from './views/outgoing-transfers/outgoing-transfers.component';
import { NewTransferComponent } from './views/outgoing-transfers/new-transfer/new-transfer.component';
import { ReceivingTransfersComponent } from './views/receiving-transfers/receiving-transfers.component';
@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    CreatenameitemsComponent,
    CreatebrandComponent,
    CreatemodelComponent,
    CreatetypeComponent,
    CreatecolorComponent,
    CreatequalityComponent,
    CreatestateiteminventoryComponent,
    PrinttiketsitemsComponent,
    OptionsitemsComponent,
    EdititemsComponent,
    DevelopmentComponent,
    OutsComponent,
    PrintticketslocalComponent,
    TablemovementsComponent,
    ReportwassapincomesComponent,
    ReporpricespdfincomesComponent,
    TableincomerepComponent,
    IncomeperComponent,
    InventorysalesComponent,
    InventorysalesnewComponent,
    MovementssalesComponent,
    TicketPrinterComponent,
    IncomesalesComponent,
    OutgoingTransfersComponent,
    NewTransferComponent,
    ReceivingTransfersComponent,   
  

  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule, // Necesario para las animaciones de toast
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxPaginationModule,
    TagInputModule,
   SweetAlert2Module, 
    NgbModule,
    NgbModalModule,
    ButtonModule,
    DialogModule, 

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule, 
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSidenavModule,
    MatExpansionModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule

  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
