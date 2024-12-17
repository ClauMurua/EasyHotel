import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'comida',
    loadChildren: () => import('./comida/comida.module').then(m => m.ComidaPageModule)
  },
  {
    path: 'actividad',
    loadChildren: () => import('./actividad/actividad.module').then(m => m.ActividadPageModule)
  },
  {
    path: 'tour',
    loadChildren: () => import('./tour/tour.module').then(m => m.TourPageModule)
  },
  {
    path: 'carrito-compra',
    loadChildren: () => import('./carrito-compra/carrito-compra.module').then(m => m.CarritoCompraPageModule)
  },
  {
    path: 'pago',
    loadChildren: () => import('./pago/pago.module').then(m => m.PagoPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./historial/historial.module').then(m => m.HistorialPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }