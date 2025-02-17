import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActividadPageRoutingModule } from './actividad-routing.module';
import { ActividadPage } from './actividad.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActividadPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ActividadPage]
})
export class ActividadPageModule {}