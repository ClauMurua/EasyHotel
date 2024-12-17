import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private dbInstance!: SQLiteObject;
  readonly db_name: string = "easy_retail.db";
  readonly db_table: string = "usuariosTable";
  private dbReady = new BehaviorSubject<boolean>(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.databaseConn();
  }

  async databaseConn() {
    await this.platform.ready();
    try {
      if (this.platform.is('cordova')) {
        this.dbInstance = await this.sqlite.create({
          name: this.db_name,
          location: 'default'
        });
        await this.setupDatabase();
        this.dbReady.next(true);
      } else {
        console.warn('Plataforma no es cordova, usando modo mock');
        this.dbReady.next(true);
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  private async setupDatabase() {
    try {
      await this.dbInstance.executeSql(`
        CREATE TABLE IF NOT EXISTS ${this.db_table} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          nombre TEXT,
          apellido TEXT,
          rol TEXT DEFAULT 'usuario',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, []);
      console.log('Tabla creada exitosamente');

      // Verificar si existe el admin
      const adminCheck = await this.dbInstance.executeSql(
        `SELECT * FROM ${this.db_table} WHERE email = ?`,
        ['admin@admin.cl']
      );

      if (adminCheck.rows.length === 0) {
        await this.dbInstance.executeSql(
          `INSERT INTO ${this.db_table} (email, password, rol) VALUES (?, ?, ?)`,
          ['admin@admin.cl', 'admin', 'admin']
        );
        console.log('Admin creado con éxito');
      }
    } catch (error) {
      console.error('Error en setupDatabase:', error);
      throw error;
    }
  }

  // Esperar a que la base de datos esté lista
  async waitForDatabase() {
    if (this.dbReady.value) return;
    return new Promise<void>((resolve) => {
      this.dbReady.subscribe((ready) => {
        if (ready) {
          resolve();
        }
      });
    });
  }

  async addUser(email: string, password: string, rol: string = 'usuario'): Promise<any> {
    try {
      await this.waitForDatabase(); // Esperar a que la base de datos esté lista

      if (this.platform.is('cordova')) {
        const data = await this.dbInstance.executeSql(
          `SELECT email FROM ${this.db_table} WHERE email = ?`,
          [email]
        );

        if (data.rows.length > 0) {
          throw new Error('El usuario ya existe');
        }

        return await this.dbInstance.executeSql(
          `INSERT INTO ${this.db_table} (email, password, rol) VALUES (?, ?, ?)`,
          [email, password, rol]
        );
      } else {
        console.log('Modo mock: Usuario simulado creado');
        return Promise.resolve();
      }
    } catch (error: any) {
      console.error('Error al añadir usuario:', error);
      throw new Error(error.message || 'Error al añadir usuario');
    }
  }

  // El resto de tus métodos (loginUser, getUserById, etc.) deberían también usar waitForDatabase()
  async loginUser(email: string, password: string): Promise<any> {
    try {
      await this.waitForDatabase();

      if (this.platform.is('cordova')) {
        const data = await this.dbInstance.executeSql(
          `SELECT * FROM ${this.db_table} WHERE email = ? AND password = ?`,
          [email, password]
        );
        return data.rows.length > 0 ? data.rows.item(0) : null;
      } else {
        return this.mockLogin(email, password);
      }
    } catch (error) {
      console.error('Error en login:', error);
      return this.mockLogin(email, password);
    }
  }

  private mockLogin(email: string, password: string): any {
    if (email === 'admin@admin.cl' && password === 'admin') {
      return {
        id: 1,
        email: 'admin@admin.cl',
        rol: 'admin'
      };
    }
    return null;
  }
}