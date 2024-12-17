import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ItemCarrito, ResumenPago, TipoItem } from '../interfaces/item-carrito.interface'; 
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoItems = new BehaviorSubject<ItemCarrito[]>([]);
  private readonly STORAGE_KEY = 'carrito';
  private tasaImpuestos = 0.18;
  private initPromise: Promise<void>;

  constructor(private storage: Storage) {
    this.initPromise = this.iniciarStorage();
  }

  private async iniciarStorage(): Promise<void> {
    try {
      await this.storage.create();
      const carritoGuardado = await this.storage.get(this.STORAGE_KEY) || [];
      console.log('Carrito guardado:', carritoGuardado);
      this.carritoItems.next(carritoGuardado);
    } catch (error) {
      console.error('Error al inicializar el storage:', error);
      this.carritoItems.next([]);
    }
  }

  obtenerCarrito(): Observable<ItemCarrito[]> {
    return from(this.initPromise).pipe(
      switchMap(() => this.carritoItems.asObservable()),
      tap(items => console.log('Emitiendo items:', items))
    );
  }

  obtenerItemsPorTipo(tipo: TipoItem): Observable<ItemCarrito[]> {
    return this.obtenerCarrito().pipe(
      map(items => items.filter(item => item.tipo === tipo))
    );
  }

  obtenerCantidadItems(): Observable<number> {
    return this.obtenerCarrito().pipe(
      map(items => items.reduce((acc, item) => acc + item.cantidad, 0))
    );
  }

  async agregarItem(item: ItemCarrito): Promise<void> {
    await this.initPromise;
    try {
      if (!item.id || !item.nombre || item.precio <= 0 || item.cantidad <= 0) {
        throw new Error('Item inválido: faltan campos requeridos o valores inválidos');
      }

      const itemsActuales = this.carritoItems.value;
      const itemExistente = itemsActuales.find(
        i => i.id === item.id && i.tipo === item.tipo
      );

      let nuevosItems: ItemCarrito[];
      if (itemExistente) {
        nuevosItems = itemsActuales.map(i =>
          i.id === item.id && i.tipo === item.tipo
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        );
      } else {
        nuevosItems = [...itemsActuales, { ...item }];
      }

      await this.storage.set(this.STORAGE_KEY, nuevosItems);
      this.carritoItems.next(nuevosItems);
    } catch (error) {
      console.error('Error al agregar item:', error);
      throw error;
    }
  }

  async removerItem(id: number, tipo: TipoItem): Promise<void> {
    await this.initPromise;
    try {
      const nuevosItems = this.carritoItems.value.filter(
        item => !(item.id === id && item.tipo === tipo)
      );
      await this.storage.set(this.STORAGE_KEY, nuevosItems);
      this.carritoItems.next(nuevosItems);
    } catch (error) {
      console.error('Error al remover item:', error);
      throw error;
    }
  }

  async actualizarCantidad(id: number, tipo: TipoItem, cantidad: number): Promise<void> {
    await this.initPromise;
    try {
      if (cantidad <= 0) {
        await this.removerItem(id, tipo);
        return;
      }

      const nuevosItems = this.carritoItems.value.map(item =>
        item.id === id && item.tipo === tipo
          ? { ...item, cantidad }
          : item
      );

      await this.storage.set(this.STORAGE_KEY, nuevosItems);
      this.carritoItems.next(nuevosItems);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  }

  calcularResumen(): Observable<ResumenPago> {
    return this.obtenerCarrito().pipe(
      map(items => {
        const subtotal = items.reduce(
          (total, item) => total + (item.precio * item.cantidad),
          0
        );
        const impuestos = subtotal * this.tasaImpuestos;
        return {
          subtotal,
          impuestos,
          total: subtotal + impuestos,
          items
        };
      })
    );
  }

  async limpiarCarrito(): Promise<void> {
    await this.initPromise;
    try {
      await this.storage.set(this.STORAGE_KEY, []);
      this.carritoItems.next([]);
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      throw error;
    }
  }
}