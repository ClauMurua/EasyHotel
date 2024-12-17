import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private databaseService: DatabaseService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        const user = await this.databaseService.loginUser(email, password);
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.presentToast(`¡Bienvenido ${user.rol === 'admin' ? 'Administrador' : ''}!`, 'success');
          this.router.navigate(['/home']);
        } else {
          this.presentToast('Credenciales incorrectas', 'danger');
        }
      } catch (error) {
        console.error('Error:', error);
        this.presentToast('Error al iniciar sesión', 'danger');
      }
    }
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}