// src/app/components/sidebar/sidebar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  paginaActual: string = '';

  usuario = {
    nombre: 'Alessandra Ambrosio',
    imagen: 'assets/images/profile.jpg'
  };

  menuItems = [
    { titulo: 'Inicio', icono: 'home-outline', ruta: '/home' },
    { titulo: 'Historial', icono: 'stats-chart-outline', ruta: '/historial' },
    { titulo: 'Tours', icono: 'map-outline', ruta: '/tour' },
    { titulo: 'Comidas', icono: 'restaurant-outline', ruta: '/comida' },
    { titulo: 'Configuración', icono: 'settings-outline', ruta: '/configuracion' }
  ];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController // Añadimos NavController para mejor navegación
  ) {
    // Observamos los cambios de ruta
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.paginaActual = event.url;
      console.log('Ruta actual:', this.paginaActual);
    });
  }

  ngOnInit() {
    this.paginaActual = this.router.url;
  }

  async navegarA(ruta: string) {
    try {
      // Usamos NavController en lugar de Router para mejor integración con Ionic
      await this.navCtrl.navigateRoot(ruta, {
        animated: true,
        animationDirection: 'forward'
      });
      
      // Cerramos el menú después de la navegación
      await this.menuCtrl.close('start');
      
      console.log('Navegación exitosa a:', ruta);
    } catch (error) {
      console.error('Error en la navegación:', error);
    }
  }
}