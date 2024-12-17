import { Component, OnInit } from '@angular/core';

interface ActivitySummary {
  name: string;
  cost: number;
  icon: string;
}

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss']
})
export class HistorialPage implements OnInit {
  stats = {
    tours: {
      value: '2',
      progress: 20,
      color: '#98FFAE'  // Verde menta
    },
    actividades: {
      value: '5',
      progress: 50,
      color: '#FF9B9B'  // Rosa
    },
    comidas: {
      value: '10',
      label: 'Pedidos',
      progress: 100,
      color: '#8F8FFF'  // Azul violeta
    }
  };

  activities: ActivitySummary[] = [
    {
      name: 'Tours Cordillera',
      cost: 49990,
      icon: 'location-outline'  // Cambiado a location-outline
    },
    {
      name: 'Actividad Sauna',
      cost: 15000,
      icon: 'accessibility-outline'  // Cambiado a accessibility-outline
    },
    {
      name: 'Langosta a la mantequilla',
      cost: 70000,
      icon: 'restaurant-outline'  // Mantenido restaurant-outline
    }
  ];

  constructor() {}

  ngOnInit() {}
}