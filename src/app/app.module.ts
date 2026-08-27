import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// ============ PRIMENG ============
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

// ============ NGX ============
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagInputModule } from 'ngx-chips';
import { NgToastModule } from 'ng-angular-popup';

// ============ SWEETALERT2 ============
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// ============ NG-BOOTSTRAP ============
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// ============ TOASTR ============
import { ToastrModule } from 'ngx-toastr';

// ============ ANGULAR MATERIAL ============
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// ============ APP ROUTING ============
import { AppRoutingModule, routingComponents } from './app-routing.module';

// ============ COMPONENTES PRINCIPALES ============
import { AppComponent } from './app.component';
import { HeaderComponent } from './views/templates/header/header.component';
import { FooterComponent } from './views/templates/footer/footer.component';
import { SidebarComponent } from './views/templates/sidebar/sidebar.component';

// ============ INVENTARIO ============
import { IncomeperComponent } from './views/incomeper/incomeper.component';
import { InventorysalesComponent } from './views/inventorysales/inventorysales.component';
import { InventorysalesnewComponent } from './views/inventorysales/inventorysalesnew/inventorysalesnew.component';
import { IncomesalesComponent } from './views/incomesales/incomesales.component';
import { MovementssalesComponent } from './views/movementssales/movementssales.component';
import { TicketPrinterComponent } from './views/ticket-printer/ticket-printer.component';
import { RepotsAllComponent } from './views/repots-all/repots-all.component';

// ============ TRANSFERENCIAS ============
import { OutgoingTransfersComponent } from './views/outgoing-transfers/outgoing-transfers.component';
import { NewTransferComponent } from './views/outgoing-transfers/new-transfer/new-transfer.component';
import { ReceivingTransfersComponent } from './views/receiving-transfers/receiving-transfers.component';

// ============ MOVIMIENTOS ============
import { MovementsFiltersComponent } from './views/movements/movements-filters/movements-filters.component';
import { MovementsTableComponent } from './views/movements/movements-table/movements-table.component';
import { MovementsPaginationComponent } from './views/movements/movements-pagination/movements-pagination.component';
import { MovementDetailModalComponent } from './views/movements/movement-detail-modal/movement-detail-modal.component';
import { MovementReportModalComponent } from './views/movements/movement-report-modal/movement-report-modal.component';
import { TablemovementsComponent } from './views/partials/tablemovements/tablemovements.component';

// ============ CANCELACIONES ============
import { CancellationRequestsComponent } from './views/cancellation-requests/cancellation-requests.component';
import { CancellationRequestResolveDialogComponent } from './views/cancellation-requests/cancellation-request-resolve-dialog/cancellation-request-resolve-dialog.component';

// ============ MODALES ============
import { CreatenameitemsComponent } from './views/modals/createnameitems/createnameitems.component';
import { CreatebrandComponent } from './views/modals/createbrand/createbrand.component';
import { CreatemodelComponent } from './views/modals/createmodel/createmodel.component';
import { CreatetypeComponent } from './views/modals/createtype/createtype.component';
import { CreatecolorComponent } from './views/modals/createcolor/createcolor.component';
import { CreatequalityComponent } from './views/modals/createquality/createquality.component';
import { CreatestateiteminventoryComponent } from './views/modals/createstateiteminventory/createstateiteminventory.component';
import { PrinttiketsitemsComponent } from './views/modals/printtiketsitems/printtiketsitems.component';
import { OptionsitemsComponent } from './views/modals/optionsitems/optionsitems.component';
import { PrintticketslocalComponent } from './views/modals/printticketslocal/printticketslocal.component';
import { ReportwassapincomesComponent } from './views/modals/reportwassapincomes/reportwassapincomes.component';
import { ReporpricespdfincomesComponent } from './views/modals/reporpricespdfincomes/reporpricespdfincomes.component';

// ============ PARTIALS ============
import { EdititemsComponent } from './views/partials/edititems/edititems.component';
import { DevelopmentComponent } from './views/partials/development/development.component';
import { OutsComponent } from './views/partials/outs/outs.component';
import { ReloadComponent } from './views/partials/reload/reload.component';
import { TableincomerepComponent } from './views/partials/tableincomerep/tableincomerep.component';

// ============ PIPES ============
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { RelativeDateZ0Pipe } from './pipes/relative-date-z0.pipe';

// ============ PEDIDOS ============
import { PedidosComponent } from './views/pedidos/pedidos.component';
import { PedidoTablaComponent } from './views/pedidos/components/pedido-tabla/pedido-tabla.component';
import { PedidoFiltrosComponent } from './views/pedidos/components/pedido-filtros/pedido-filtros.component';
import { NuevoPedidoComponent } from './views/pedidos/components/nuevo-pedido/nuevo-pedido.component';
import { PedidoModalComponent } from './views/pedidos/components/pedido-modal/pedido-modal.component';
import { InventarioTablaComponent } from './views/pedidos/components/inventario-tabla/inventario-tabla.component';
import { PedidoInventarioTablaComponent } from './views/pedidos/components/pedido-inventario-tabla/pedido-inventario-tabla.component';
import { ImprimirModalComponent } from './views/pedidos/components/imprimir-modal/imprimir-modal.component';
import { AsignarPedidoModalComponent } from './views/income/components/asignar-pedido-modal/asignar-pedido-modal.component';
import { DesguaceComponent } from './views/inventory/components/desguace/desguace.component';

@NgModule({
  declarations: [
    // ============ COMPONENTES PRINCIPALES ============
    AppComponent,
    routingComponents,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,

    // ============ INVENTARIO ============
    IncomeperComponent,
    InventorysalesComponent,
    InventorysalesnewComponent,
    IncomesalesComponent,
    MovementssalesComponent,
    TicketPrinterComponent,
    RepotsAllComponent,

    // ============ TRANSFERENCIAS ============
    OutgoingTransfersComponent,
    NewTransferComponent,
    ReceivingTransfersComponent,

    // ============ MOVIMIENTOS ============
    MovementsFiltersComponent,
    MovementsTableComponent,
    MovementsPaginationComponent,
    MovementDetailModalComponent,
    MovementReportModalComponent,
    TablemovementsComponent,

    // ============ CANCELACIONES ============
    CancellationRequestsComponent,
    CancellationRequestResolveDialogComponent,

    // ============ MODALES ============
    CreatenameitemsComponent,
    CreatebrandComponent,
    CreatemodelComponent,
    CreatetypeComponent,
    CreatecolorComponent,
    CreatequalityComponent,
    CreatestateiteminventoryComponent,
    PrinttiketsitemsComponent,
    OptionsitemsComponent,
    PrintticketslocalComponent,
    ReportwassapincomesComponent,
    ReporpricespdfincomesComponent,

    // ============ PARTIALS ============
    EdititemsComponent,
    DevelopmentComponent,
    OutsComponent,
    ReloadComponent,
    TableincomerepComponent,

    // ============ PIPES ============
    RelativeDatePipe,
    RelativeDateZ0Pipe,

    // ============ PEDIDOS ============
    PedidosComponent,
    PedidoTablaComponent,
    PedidoFiltrosComponent,
    NuevoPedidoComponent,
    PedidoModalComponent,
    InventarioTablaComponent,
    PedidoInventarioTablaComponent,
    ImprimirModalComponent,
    AsignarPedidoModalComponent,
    DesguaceComponent,
  ],
  imports: [
    // ============ ANGULAR ============
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,

    // ============ APP ROUTING ============
    AppRoutingModule,

    // ============ PRIMENG ============
    ButtonModule,
    DialogModule,

    // ============ NGX ============
    NgxPaginationModule,
    NgSelectModule,
    TagInputModule,
    NgToastModule,

    // ============ SWEETALERT2 ============
    SweetAlert2Module,

    // ============ NG-BOOTSTRAP ============
    NgbModule,
    NgbModalModule,

    // ============ TOASTR ============
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),

    // ============ ANGULAR MATERIAL ============
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }