import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComidaPageRoutingModule } from './comida-routing.module';

import { ComidaPage } from './comida.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComidaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ComidaPage]
})
export class ComidaPageModule {}
