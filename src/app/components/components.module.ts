// src/app/components/components.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CircularProgressComponent } from './circular-progress/circular-progress.component';

@NgModule({
declarations: [
    SidebarComponent,
    CircularProgressComponent
],
imports: [
    CommonModule,
    IonicModule,
    RouterModule
],
exports: [
    SidebarComponent,
    CircularProgressComponent
],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }