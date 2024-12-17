import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { CarritoService } from '../services/carrito.service';
import { ItemCarrito, TipoItem } from '../interfaces/item-carrito.interface';

// Definimos una interfaz para categorizar los platos
interface CategoriaMenu {
  id: number;
  nombre: string;
  descripcion: string;
}

// Definimos una interfaz para los platos individuales
interface Plato {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  tiempoPreparacion: string;
  calorias?: number;  // Opcional, por eso usamos ?
  nivelPicante?: 1 | 2 | 3;  // 1 = poco, 2 = medio, 3 = muy picante
  disponible: boolean;
  ingredientes: string[];
  etiquetas: string[];  // Por ejemplo: "Vegetariano", "Sin Gluten", etc.
}

@Component({
  selector: 'app-comida',
  templateUrl: './comida.page.html',
  styleUrls: ['./comida.page.scss'],
})
export class ComidaPage implements OnInit {
  // Definimos las categorías del menú
  categorias: CategoriaMenu[] = [
    {
      id: 1,
      nombre: 'Entradas',
      descripcion: 'Platos ligeros para comenzar'
    },
    {
      id: 2,
      nombre: 'Platos Principales',
      descripcion: 'Especialidades de la casa'
    },
    {
      id: 3,
      nombre: 'Postres',
      descripcion: 'Dulces tradicionales'
    }
  ];

  // Lista de platos disponibles
  platos: Plato[] = [
    {
      id: 1,
      nombre: 'Ceviche Tradicional',
      descripcion: 'Pescado fresco marinado en limón con ají, cebolla y cilantro',
      precio: 25,
      imagen: 'assets/images/imagen-comida-ceviche.webp',
      categoria: 'Entradas',
      tiempoPreparacion: '15 min',
      nivelPicante: 2,
      disponible: true,
      ingredientes: ['Pescado fresco', 'Limón', 'Cebolla', 'Cilantro', 'Ají'],
      etiquetas: ['Sin Gluten', 'Pescado']
    },
    {
      id: 2,
      nombre: 'Lomo Saltado',
      descripcion: 'Tradicional plato peruano con carne de res, verduras y papas fritas',
      precio: 35,
      imagen: 'assets/images/imagen-comida-lomoSaltado.jpg',
      categoria: 'Platos Principales',
      tiempoPreparacion: '25 min',
      calorias: 850,
      disponible: true,
      ingredientes: ['Lomo fino', 'Cebolla', 'Tomate', 'Papas', 'Arroz'],
      etiquetas: ['Plato Caliente']
    }
  ];

  // Variable para controlar la categoría seleccionada
  categoriaActual: string = 'Todos';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private carritoService: CarritoService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  // Método para filtrar platos por categoría
  filtrarPlatosPorCategoria(categoria: string): Plato[] {
    if (categoria === 'Todos') {
      return this.platos;
    }
    return this.platos.filter(plato => plato.categoria === categoria);
  }

  // Método para obtener el icono según el nivel de picante
  obtenerIconoPicante(nivel: number | undefined): string {
    if (!nivel) return '';
    return '🌶️'.repeat(nivel);
  }

  // Método para cambiar la categoría actual
  cambiarCategoria(evento: any) {
    if (evento) {
      this.categoriaActual = String(evento);
    }
  }

  async realizarPedido(plato: Plato) {
    if (plato.disponible) {
      try {
        const itemCarrito: ItemCarrito = {
          id: plato.id,
          nombre: plato.nombre,
          descripcion: plato.descripcion,
          precio: plato.precio,
          cantidad: 1,
          imagen: plato.imagen,
          tipo: TipoItem.Comida,
          tiempoPreparacion: plato.tiempoPreparacion,
          calorias: plato.calorias,
          ingredientes: plato.ingredientes,
          etiquetas: plato.etiquetas
        };

        await this.carritoService.agregarItem(itemCarrito);
        
        const toast = await this.toastController.create({
          message: `${plato.nombre} agregado al carrito`,
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
        console.error('Error al agregar comida al carrito:', error);
        const toast = await this.toastController.create({
          message: 'Error al agregar la comida al carrito',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
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