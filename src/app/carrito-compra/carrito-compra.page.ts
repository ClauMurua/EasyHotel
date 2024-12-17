import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../services/carrito.service';
import { ItemCarrito, ResumenPago } from '../interfaces/item-carrito.interface';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-compra',
  templateUrl: './carrito-compra.page.html',
  styleUrls: ['./carrito-compra.page.scss']
})
export class CarritoCompraPage implements OnInit {
  items$ = new BehaviorSubject<ItemCarrito[]>([]);
  resumen$ = new BehaviorSubject<ResumenPago>({
    subtotal: 0,
    impuestos: 0,
    total: 0,
    items: []
  });
  cargando = true;
  error = '';

  constructor(
    private carritoService: CarritoService,
    private alertController: AlertController,
    private router: Router
  ) {
    console.log('CARRITO COMPRA PAGE: Constructor llamado');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter: Cargando datos');
    this.cargarDatos();
  }

  ngOnInit() {
    console.log('CARRITO COMPRA PAGE: NgOnInit iniciado');
  }

  cargarDatos() {
    this.cargando = true;
    this.error = '';
    console.log('Iniciando carga de datos');

    this.carritoService.obtenerCarrito().subscribe({
      next: (items) => {
        console.log('Items recibidos:', items);
        this.items$.next(items);
      },
      error: (err) => {
        console.error('Error al obtener items:', err);
        this.error = 'Error al cargar el carrito';
      }
    });

    this.carritoService.calcularResumen().subscribe({
      next: (resumen) => {
        console.log('Resumen recibido:', resumen);
        this.resumen$.next(resumen);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al calcular resumen:', err);
        this.error = 'Error al calcular el resumen';
        this.cargando = false;
      }
    });
  }

  async cambiarCantidad(item: ItemCarrito, incremento: boolean) {
    const nuevaCantidad = incremento ? item.cantidad + 1 : item.cantidad - 1;
    
    try {
      if (nuevaCantidad <= 0) {
        // Si la nueva cantidad es 0 o menor, eliminamos el item
        await this.confirmarEliminacion(item);
      } else {
        await this.carritoService.actualizarCantidad(item.id, item.tipo, nuevaCantidad);
        console.log(`Cantidad actualizada para ${item.nombre}`);
      }
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  }

  async confirmarEliminacion(item: ItemCarrito, confirmacionDirecta: boolean = false) {
    if (confirmacionDirecta) {
      try {
        await this.carritoService.removerItem(item.id, item.tipo);
        console.log(`Item eliminado: ${item.nombre}`);
      } catch (error) {
        console.error('Error al eliminar item:', error);
      }
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Eliminar item',
      message: '¿Estás seguro que deseas eliminar este item del carrito de compra?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.carritoService.removerItem(item.id, item.tipo);
              console.log(`Item eliminado: ${item.nombre}`);
            } catch (error) {
              console.error('Error al eliminar item:', error);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async procederPago() {
    try {
      await this.router.navigate(['/pago']);
    } catch (error) {
      console.error('Error al navegar a pago:', error);
    }
  }
}