import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { InventoryTransfersApiService } from 'src/app/service/inventory-transfers-api/inventory-transfers-api.service'; 
import { ApiService } from 'src/app/service/api/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { BarcodeScannerService } from 'src/app/service/barcode-scanner/barcode-scanner.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 
import { UbicacionCompartidaService } from 'src/app/service/ubicacion-compartida/ubicacion-compartida.service';
interface Product {
  id: string;
  sku: string;
  upc: string;
  color: string;
  name: string;
  model: string;
  quality: string;
  state: string;
  stocks: string;
  batchNumber:any;
}

interface Branch {
  id: string;
  name: string;
}

interface SelectedProduct {
  product: Product;
  quantity: number;
  destination_branch_id: string;
  destination_stock?: number;
  observation?: string;
}
@Component({
  selector: 'app-new-transfer',
  templateUrl: './new-transfer.component.html',
  styleUrls: ['./new-transfer.component.css']
})
export class NewTransferComponent {  
  private subscriptions: Subscription = new Subscription();
  isButtonDisabled = false;
  form: FormGroup;
  products: Product[] = [];
  branches: Branch[] = [];
  allProducts: Product[] = [];
  selectedProducts: SelectedProduct[] = [];
  loading = false;
  scannedCode = '';
  isInputLocked: boolean = false;
  private inputLockTimeout: any;
  private subscription!: Subscription;
  constructor(private barcodeScannerService: BarcodeScannerService, private cdr: ChangeDetectorRef,
     private fb: FormBuilder, private inventorytransferapi: InventoryTransfersApiService, 
      private api: ApiService,private router: Router,
     private ubicacionService: UbicacionCompartidaService) {
    this.form = this.fb.group({
      productCtrl: [''],
    });
  }
ubicasion: any = ''
  ngOnInit() {this.subscriptions.add(
    this.ubicacionService.coordenadas$.subscribe(coords => {
      this.ubicasion = coords
      if (this.ubicasion &&
        this.ubicasion !== '' &&
        this.ubicasion.latitud &&
        this.ubicasion.longitud &&
        this.ubicasion.latitud !== 0 &&
        this.ubicasion.longitud !== 0) {
          this.getdata(); 
      }
    })
  );
    
    this.barcodeScannerService.listenForScan(28, 29) // mínimo y máximo
      .subscribe(code => { 
        this.productCtrl.setValue(code);
        this.onSearchClick() 
        // Aquí haces tu búsqueda o lo que necesites
      });
    this.productCtrl.valueChanges.subscribe(value => {
      if (typeof value !== 'string' || this.loading) return;

      const input = value.trim().toUpperCase();
      const terms = input.split(' ').filter(term => term.length > 0);

      this.products = this.allProducts.filter(product =>
        terms.every(term =>
          product.name.toUpperCase().includes(term) ||
          product.model.toUpperCase().includes(term) ||
          product.sku.toUpperCase().includes(term)
        )
      );
    });
   
  } 
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    } 
  }

  async getdata() {
    const data = await this.inventorytransferapi.getnewdata(this.ubicasion)
    this.branches = data.branches

  } 

  displayFn(product?: Product): string {
    return product ? product.name : '';
  }
  get productCtrl(): FormControl {
    return this.form.get('productCtrl') as FormControl;
  }
  clearSearch() {
    this.productCtrl.setValue('');
    this.products = [];
    this.allProducts = [];
  }
  onSearchClick() {
    this.onSearchEnter();
  }
  async onSearchEnter() {
    const value = this.productCtrl.value;

    if (value && typeof value === 'string') {
      if (!this.isInputLocked) {
        this.isInputLocked = true;
        this.loading = true;
        this.inputLockTimeout = setTimeout(() => {
          this.isInputLocked = false;
        }, 3000);
        try {
          const data = await this.inventorytransferapi.finditem({
            value,
            coordinates: this.ubicasion
          });
          
          // Si la respuesta llega antes, cancelamos el timeout
          clearTimeout(this.inputLockTimeout);
          this.isInputLocked = false;
          
          this.allProducts = data.items.data;
          this.products = [...this.allProducts];
  
          if (data.items.auto) {
            this.addProduct(data.items.data[0]);
            this.allProducts = [];
            this.products = [...this.allProducts];
          }
  
        } catch (error) {
          // Manejo de errores
          clearTimeout(this.inputLockTimeout);
          this.isInputLocked = false;
        } finally {
          this.loading = false;
        }
      }
    }
  }

  addProduct(product: Product) {
    const totalQuantity = this.selectedProducts
      .filter(p => p.product.id === product.id)
      .reduce((sum, p) => sum + Number(p.quantity), 0);
  
    const stock = Number(product.stocks);
  
    if (totalQuantity >= stock) {
      // Mostrar mensaje o notificación 
      return;
    }
  
    this.selectedProducts.push({
      product,
      quantity: 1,
      destination_branch_id: '',
    });
  
    this.productCtrl.setValue('');
  }

  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }
 async onBranchChange(p: SelectedProduct) {
    if (p.destination_branch_id && p.product.id) {
      const data =await this.inventorytransferapi.destinationstock({product:p.product.id,branch: p.destination_branch_id}) 
      p.destination_stock = data.stock;
 
    }
  }
  async submit() {
    const invalid = this.selectedProducts.some(p => !p.destination_branch_id || !p.quantity || p.quantity <= 0);

    if (invalid) {
      return;
    }
    this.isButtonDisabled = true;
    const payload = this.selectedProducts.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      destination_branch_id: item.destination_branch_id,
      observation:item.observation
    }));
    try {
      await this.inventorytransferapi.saveitem({payload,coordinates: this.ubicasion})
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La operación se realizó correctamente.',
        confirmButtonText: 'Aceptar'
      }).then(() => {

        // Redirigir después de que el usuario presiona "Aceptar"
        this.router.navigate(['/outgoing-transfers']);
        this.isButtonDisabled = false;
      }); 
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al realizar la operación.',
        confirmButtonText: 'Cerrar'
      }).then(()=>{
        this.isButtonDisabled = false;
      });
    }
    
  }
  validateQuantity(productItem: any, inputRef: HTMLInputElement) {
    const productId = productItem.product.id;
  
    const totalQuantity = this.selectedProducts
      .filter(p => p.product.id === productId)
      .reduce((sum, p) => sum + Number(p.quantity), 0);
  
    const stock = Number(productItem.product.stocks);
  
    if (totalQuantity > stock) {
      const otherQuantity = totalQuantity - Number(productItem.quantity);
      productItem.quantity = stock - otherQuantity;
  
      if (productItem.quantity < 1) {
        productItem.quantity = 1;
      }
  
      // 🔧 Forzar actualización visual del input directamente
      inputRef.value = productItem.quantity;
  
      // 🔄 Aseguramos que ngModel se sincronice
      this.cdr.detectChanges();
    }
  }
  hasError(index: number): boolean {
    const item = this.selectedProducts[index];
    return !item.destination_branch_id || !item.quantity || item.quantity <= 0;
  } 
}
