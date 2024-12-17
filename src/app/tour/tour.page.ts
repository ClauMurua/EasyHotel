import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Tour } from '../interfaces/tour.interface';
import { CarritoService } from '../services/carrito.service';
import { ItemCarrito, TipoItem } from '../interfaces/item-carrito.interface';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.page.html',
  styleUrls: ['./tour.page.scss'],
})
export class TourPage implements OnInit {
  tours: Tour[] = [
    {
      id: 1,
      name: 'Tour Valle Sagrado',
      description: 'Explora los lugares más hermosos del valle',
      price: 150,
      duration: '8 horas',
      image: 'assets/images/imagen-tours-valleSsagrado.jpg',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Montaña de Siete Colores',
      description: 'Aventura en la montaña arcoíris',
      price: 200,
      duration: '12 horas',
      image: 'assets/images/imagen-tours-montañaSieteColores.jpg',
      rating: 4.8
    }
  ];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private carritoService: CarritoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async bookTour(tour: Tour) {
    try {
      const itemCarrito: ItemCarrito = {
        id: tour.id,
        nombre: tour.name,
        descripcion: tour.description,
        precio: tour.price,
        cantidad: 1,
        imagen: tour.image,
        tipo: TipoItem.Tour,
        duracion: tour.duration,
        rating: tour.rating
      };

      await this.carritoService.agregarItem(itemCarrito);
      
      // Este es el toast con el botón "Ver Carrito"
    const toast = await this.toastController.create({
      message: `${tour.name} agregado al carrito`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          text: 'Ver Carrito',
          handler: () => {
            this.router.navigate(['/carrito-compra']);
          }
        }
      ]
    });
    await toast.present();
    
  } catch (error) {
    console.error('Error al agregar tour al carrito:', error);
    const toast = await this.toastController.create({
      message: 'Error al agregar el tour al carrito',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}

  irAlCarrito() {
    console.log('Intentando navegar al carrito');
    this.router.navigate(['/carrito-compra']).then(
      () => console.log('Navegación al carrito exitosa'),
      (error) => {
        console.error('Error al navegar al carrito:', error);
        this.navCtrl.navigateForward('/carrito-compra');
      }
    );
  }
}