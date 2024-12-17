// src/app/pages/tours/tours.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ToursPageRoutingModule } from './tour-routing.module';
import { TourPage } from './tour.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ToursPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TourPage]
})
export class TourPageModule {}