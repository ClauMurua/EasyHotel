import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage {
  metodoPagoSeleccionado: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private carritoService: CarritoService
  ) {}

  seleccionarMetodoPago(metodo: string) {
    this.metodoPagoSeleccionado = metodo;
    this.mostrarConfirmacion(metodo);
  }

  async mostrarConfirmacion(metodo: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar método de pago',
      message: `¿Deseas pagar con ${metodo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.procesarPago();
          }
        }
      ]
    });

    await alert.present();
  }

  async procesarPago() {
    const alert = await this.alertController.create({
      header: '¡Pago Exitoso!',
      message: 'Tu pedido ha sido procesado correctamente.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.carritoService.limpiarCarrito();
          this.router.navigate(['/home']);
        }
      }]
    });

    await alert.present();
  }

  pagar() {
    if (!this.metodoPagoSeleccionado) {
      this.mostrarErrorMetodoPago();
      return;
    }
    this.procesarPago();
  }

  async mostrarErrorMetodoPago() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Por favor selecciona un método de pago',
      buttons: ['OK']
    });

    await alert.present();
  }
}