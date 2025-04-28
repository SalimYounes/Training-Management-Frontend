import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalUsers: number = 0;
  totalFormations: number = 0;
  totalFormateurs: number = 0;
  totalParticipants: number = 0;
  
  userDetails: any;
  formations: any[] = [];

  // Références aux graphiques pour pouvoir les détruire et recréer proprement
  usersChart: any;
  percentageChart: any;
  topFormationsChart: any;

  constructor(private service: CrudserviceService) { 
    this.userDetails = this.service.userDetails();
  }

  ngOnInit(): void {
    this.loadStatistics();
  }

  // Charger toutes les statistiques
  loadStatistics() {
    this.service.getUser().subscribe(users => {
      this.totalUsers = users.length;
      this.updateUserTypeChart(); // Une fois les utilisateurs récupérés
      this.updatePercentageChart(); // Rafraîchir aussi le camembert
    });

    this.service.getFormations().subscribe(formations => {
      this.totalFormations = formations.length;
      this.formations = formations;
      this.updateTopFormationsChart();
      this.updatePercentageChart();
    });

    this.service.getFormateurs().subscribe(formateurs => {
      this.totalFormateurs = formateurs.length;
      this.updateUserTypeChart();
    });

    this.service.getParticipants().subscribe(participants => {
      this.totalParticipants = participants.length;
      this.updateUserTypeChart();
      this.updatePercentageChart();
    });
  }

  updateUserTypeChart() {
    // Détruire l'ancien graphique avant d'en créer un nouveau
    if (this.usersChart) {
      this.usersChart.destroy();
    }

    this.usersChart = new Chart('usersChart', {
      type: 'doughnut',
      data: {
        labels: ["Formateurs", "Participants", "Autres utilisateurs"],
        datasets: [{
          data: [
            this.totalFormateurs,
            this.totalParticipants,
            Math.max(this.totalUsers - (this.totalFormateurs + this.totalParticipants), 0)
          ],
          backgroundColor: ['#ff8a65', '#9400d3', '#4bc0c0'],
          borderColor: ['#ff8a65', '#9400d3', '#4bc0c0'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Distribution des utilisateurs'
          }
        }
      }
    });
  }

  updatePercentageChart() {
    const totalEntities = this.totalUsers + this.totalFormations + this.totalParticipants;

    if (totalEntities === 0) {
      return; // éviter division par zéro
    }

    const percentageUsers = (this.totalUsers / totalEntities) * 100;
    const percentageFormations = (this.totalFormations / totalEntities) * 100;
    const percentageParticipants = (this.totalParticipants / totalEntities) * 100;

    if (this.percentageChart) {
      this.percentageChart.destroy();
    }

    this.percentageChart = new Chart('percentageCanvas', {
      type: 'pie',
      data: {
        labels: ["Utilisateurs", "Formations", "Participants"],
        datasets: [{
          data: [percentageUsers, percentageFormations, percentageParticipants],
          backgroundColor: ['#ff8a65', '#4bc0c0', '#9400d3'],
          borderColor: ['#ff8a65', '#4bc0c0', '#9400d3'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Répartition des entités sur la plateforme'
          }
        }
      }
    });
  }

  updateTopFormationsChart() {
    if (this.topFormationsChart) {
      this.topFormationsChart.destroy();
    }

    const formationStats = this.formations.map(formation => ({
      nom: formation.titre || 'Formation sans titre',
      participants: Math.floor(Math.random() * 30) + 1 // ⚡ Simuler pour maintenant
    }));

    const sortedFormations = formationStats.sort((a, b) => b.participants - a.participants);
    const topFormations = sortedFormations.slice(0, 5);

    const labels = topFormations.map(f => f.nom);
    const data = topFormations.map(f => f.participants);

    const colors = ['#4bc0c0', '#8B65D2', '#36a2eb', '#ffce56', '#9966ff'];

    this.topFormationsChart = new Chart('topFormationsChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2,
          label: 'Participants'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Top 5 des formations par participants'
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
