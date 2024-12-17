import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  perfilData = {
    nombre: 'Alessandra Ambrosio',
    rut: '20.654.987-K',
    email: 'ale.ambrosio@gmail.br',
    contacto: '+56 9 1234 9876',
    nacionalidad: 'Brasileña',
    reserva: {
      habitacion: '404',
      acompanantes: 2,
      checkIn: '04-11-2024 15:00:00',
      checkOut: '12-11-2024 12:00:00',
      tipoHabitacion: 'Penthouse'
    }
  };

  constructor() {}

  ngOnInit() {}

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt
      });

      if (image.webPath) {
        const profileImage = document.querySelector('.imagen-perfil img') as HTMLImageElement;
        if (profileImage) {
          profileImage.src = image.webPath;
        }
      }
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }
}