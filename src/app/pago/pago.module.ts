import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagoPageRoutingModule } from './pago-routing.module';
import { PagoPage } from './pago.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,
    PagoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PagoPage]
})
export class PagoPageModule {}