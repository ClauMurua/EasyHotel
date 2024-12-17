import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { CarritoService } from '../services/carrito.service';
import { ItemCarrito, TipoItem } from '../interfaces/item-carrito.interface';

interface Actividad {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  dificultad: 'Fácil' | 'Moderado' | 'Difícil';
  imagen: string;
  duracion: string;
  participantesMaximos: number;
  espaciosDisponibles: number;
  ubicacion: string;
  incluye: string[];
}

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.page.html',
  styleUrls: ['./actividad.page.scss'],
})
export class ActividadPage implements OnInit {
  actividades: Actividad[] = [
    {
      id: 1,
      nombre: 'Trekking a la Montaña',
      descripcion: 'Disfruta de una emocionante caminata por senderos naturales con vistas panorámicas.',
      precio: 80,
      dificultad: 'Moderado',
      imagen: 'assets/images/imagen-actividad-treakkingMontaña.jpg',
      duracion: '4 horas',
      participantesMaximos: 12,
      espaciosDisponibles: 8,
      ubicacion: 'Valle Sagrado',
      incluye: ['Guía especializado', 'Equipo de seguridad', 'Snacks', 'Transporte']
    },
    {
      id: 2,
      nombre: 'Ciclismo de Montaña',
      descripcion: 'Recorre hermosos paisajes en bicicleta a través de rutas especialmente diseñadas.',
      precio: 100,
      dificultad: 'Difícil',
      imagen: 'assets/images/imagen-actividad-ciclismoMontaña.webp',
      duracion: '3 horas',
      participantesMaximos: 8,
      espaciosDisponibles: 5,
      ubicacion: 'Senderos del Valle',
      incluye: ['Bicicleta', 'Casco', 'Guantes', 'Guía experto', 'Refrigerio']
    }
  ];

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private carritoService: CarritoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async reservarActividad(actividad: Actividad) {
    if (actividad.espaciosDisponibles > 0) {
      try {
        const itemCarrito: ItemCarrito = {
          id: actividad.id,
          nombre: actividad.nombre,
          descripcion: actividad.descripcion,
          precio: actividad.precio,
          cantidad: 1,
          imagen: actividad.imagen,
          tipo: TipoItem.Actividad,
          duracion: actividad.duracion,
          ubicacion: actividad.ubicacion,
          dificultad: actividad.dificultad,
          incluye: actividad.incluye
        };

        await this.carritoService.agregarItem(itemCarrito);
        
        const toast = await this.toastController.create({
          message: `${actividad.nombre} agregada al carrito`,
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
        console.error('Error al agregar actividad al carrito:', error);
        const toast = await this.toastController.create({
          message: 'Error al agregar la actividad al carrito',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  obtenerColorDificultad(dificultad: string): string {
    switch (dificultad) {
      case 'Fácil': return 'success';
      case 'Moderado': return 'warning';
      case 'Difícil': return 'danger';
      default: return 'medium';
    }
  }

  async irAlCarrito() {
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