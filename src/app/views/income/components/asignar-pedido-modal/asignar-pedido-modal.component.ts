// asignar-pedido-modal.component.ts
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PedidoService } from 'src/app/service/pedido/pedido.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-pedido-modal',
  templateUrl: './asignar-pedido-modal.component.html',
  styleUrls: ['./asignar-pedido-modal.component.css']
})
export class AsignarPedidoModalComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'name',
    'quantity',
    'estimatedPrice',
    'status',
    'createdBy',
    'sku',
    'batchId',
    'action'
  ];

  pedidoSeleccionado: any = null;
  loading: boolean = false;
  asignando: boolean = false;
  terminoBusqueda: string = '';
  
  // ✅ Lista de pedidos que ya han sido seleccionados (para no mostrarlos)
  pedidosSeleccionadosIds: string[] = [];

  constructor(
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AsignarPedidoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      incomeId: string, 
      sku: string, 
      batchId: string, 
      actualPrice: number,
      itemName?: string
    }
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async cargarPedidos() {
    this.loading = true;
    try {
      const response = await this.pedidoService.getPedidosEnInventario(1, 100, '');
      const pedidos = response?.data?.pedidos || [];
      
      // ✅ FILTRO: Mismo que en pedido-inventario-tabla
      const pedidosFiltrados = pedidos.filter(pedido => {
        // 1. Tiene estado 'inventario'
        const esInventario = pedido.status === 'inventario';
        
        // 2. NO tiene SKU (aún no asignado)
        const noTieneSku = !pedido.sku || pedido.sku === '—' || pedido.sku === null;
        
        // 3. NO tiene BatchId (aún no asignado)
        const noTieneBatch = !pedido.batchId || pedido.batchId === '—' || pedido.batchId === null;
        
        // 4. No ha sido seleccionado previamente en este modal
        const noSeleccionado = !this.pedidosSeleccionadosIds.includes(pedido._id);
        
        // ✅ Mostrar SOLO: inventario + sin SKU + sin Batch + no seleccionado
        return esInventario && noTieneSku && noTieneBatch && noSeleccionado;
      });

      console.log(`📋 Pedidos en inventario sin SKU/Batch: ${pedidosFiltrados.length} de ${pedidos.length}`);
      
      this.dataSource.data = pedidosFiltrados;
      
      // Configurar filtro personalizado
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.name?.toLowerCase().includes(filter) ||
               data.description?.toLowerCase().includes(filter);
      };

    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.snackBar.open('❌ Error al cargar pedidos', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.terminoBusqueda = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  seleccionarPedido(pedido: any) {
    if (pedido.skuAsignado) {
      this.snackBar.open('⚠️ Este pedido ya tiene un SKU asignado', 'Cerrar', { duration: 2000 });
      return;
    }
    this.pedidoSeleccionado = pedido;
  }

  async confirmarAsignacion() {
    if (!this.pedidoSeleccionado) {
      this.snackBar.open('⚠️ Selecciona un pedido', 'Cerrar', { duration: 2000 });
      return;
    }
    
    if (!this.data.sku || !this.data.batchId) {
      this.snackBar.open('⚠️ Falta SKU o Batch ID', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.pedidoSeleccionado.skuAsignado) {
      this.snackBar.open('⚠️ Este pedido ya tiene SKU asignado', 'Cerrar', { duration: 3000 });
      return;
    }

    // Confirmar antes de asignar
    const confirm = await Swal.fire({
      title: '¿Asignar este pedido?',
      html: `
        <p>Se asignará el SKU <strong>${this.data.sku}</strong> al pedido:</p>
        <p class="fw-bold text-primary">"${this.pedidoSeleccionado.name}"</p>
        <p class="text-muted small">Cantidad: ${this.pedidoSeleccionado.quantity || 1}</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1976d2',
      cancelButtonColor: '#dc3545',
      confirmButtonText: '✅ Sí, asignar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    this.asignando = true;
    try {
      await this.pedidoService.asignarSkuYBatch(
        this.pedidoSeleccionado._id,
        {
          sku: this.data.sku,
          batchId: this.data.batchId,
          actualPrice: this.data.actualPrice || 0
        }
      );
      
      // ✅ Agregar el pedido a la lista de seleccionados para que no aparezca más
      this.pedidosSeleccionadosIds.push(this.pedidoSeleccionado._id);
      
      // ✅ Recargar la lista para actualizar los pedidos disponibles
      await this.cargarPedidos();
      
      this.snackBar.open('✅ Pedido asignado exitosamente', 'Cerrar', { duration: 3000 });
      
      this.dialogRef.close({ 
        success: true, 
        pedido: this.pedidoSeleccionado,
        sku: this.data.sku,
        batchId: this.data.batchId
      });
      
    } catch (error: any) {
      console.error('Error al asignar:', error);
      this.snackBar.open(`❌ ${error?.message || 'Error al asignar'}`, 'Cerrar', { duration: 4000 });
    } finally {
      this.asignando = false;
    }
  }

  cerrarModal() {
    this.dialogRef.close();
  }

  // Función para obtener el nombre del creador
  getCreatedBy(pedido: any): string {
    if (pedido.createdBy) {
      return `${pedido.createdBy.nombre || ''} ${pedido.createdBy.apellido || ''}`.trim() || 'Sistema';
    }
    return 'Sistema';
  }
}