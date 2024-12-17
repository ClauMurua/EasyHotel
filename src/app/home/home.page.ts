import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private databaseService: DatabaseService
  ) {
    this.checkAdminStatus();
  }

  ngOnInit() {
    // Configuración del Swiper mediante JavaScript
    const swiperEl = document.querySelector('swiper-container');
    if (swiperEl) {
      Object.assign(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
          clickable: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });
      
      swiperEl.initialize();
    }
  }

  checkAdminStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.isAdmin = user.email === 'admin@admin.cl';
    }
  }

  async crearNuevoUsuario() {
    const alert = await this.alertController.create({
      header: 'Crear Nuevo Usuario',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña'
        },
        {
          name: 'rol',
          type: 'text',
          placeholder: 'Rol (usuario/admin)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.email || !data.password || !data.rol) {
              this.mostrarError('Todos los campos son requeridos');
              return;
            }

            try {
              await this.databaseService.addUser(data.email, data.password, data.rol);
              this.mostrarExito('Usuario creado exitosamente');
            } catch (error: any) {
              this.mostrarError(error.message || 'Error al crear usuario');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostrarExito(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  onCategoryClick(category: string) {
    switch(category.toLowerCase()) {
      case 'tours':
        this.router.navigate(['/tour']);
        break;
      case 'actividades':
        this.router.navigate(['/actividad']);
        break;
      case 'comidas':
        this.router.navigate(['/comida']);
        break;
    }
  }
}