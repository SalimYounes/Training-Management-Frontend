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
  
  constructor(private service: CrudserviceService) { 
    this.userDetails = this.service.userDetails();
  }

  ngOnInit(): void {
    // Récupérer les statistiques des utilisateurs
    this.service.getUser().subscribe(users => {
      this.totalUsers = users.length;
      this.updateUserTypeChart();
    });

    // Récupérer les statistiques des formations
    this.service.getFormations().subscribe(formations => {
      this.totalFormations = formations.length;
      this.formations = formations;
      this.updateTopFormationsChart();
    });

    // Récupérer les statistiques des formateurs
    this.service.getFormateurs().subscribe(formateurs => {
      this.totalFormateurs = formateurs.length;
      this.updatePercentageChart();
    });

    // Récupérer les statistiques des participants
    this.service.getParticipants().subscribe(participants => {
      this.totalParticipants = participants.length;
      this.updatePercentageChart();
    });
  }

  // Méthode pour mettre à jour le graphique des types d'utilisateurs
  updateUserTypeChart() {
    const usersChart = new Chart('usersChart', {
      type: 'doughnut',
      data: {
        labels: ["Formateurs", "Participants", "Autres utilisateurs"],
        datasets: [{
          label: 'Types d\'utilisateurs',
          data: [this.totalFormateurs, this.totalParticipants, this.totalUsers - (this.totalFormateurs + this.totalParticipants)],
          backgroundColor: [
            '#ff8a65', // Couleur pour les formateurs
            '#9400d3', // Couleur pour les participants
            '#4bc0c0'  // Couleur pour les autres utilisateurs
          ],
          borderColor: [
            '#ff8a65',
            '#9400d3',
            '#4bc0c0'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Arial',
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Distribution des utilisateurs',
            font: {
              family: 'Arial',
              size: 18,
              weight: 'bold'
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      }
    });
  }

  // Méthode pour mettre à jour le graphique des pourcentages 
  updatePercentageChart() {
    const totalEntities = this.totalUsers + this.totalFormations + this.totalParticipants;

    const percentageUsers = (this.totalUsers / totalEntities) * 100;
    const percentageFormations = (this.totalFormations / totalEntities) * 100;
    const percentageParticipants = (this.totalParticipants / totalEntities) * 100;

    const percentageChart = new Chart('percentageCanvas', {
      type: 'pie',
      data: {
        labels: ["Utilisateurs", "Formations", "Participants"],
        datasets: [{
          label: 'Pourcentage des entités',
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
            position: 'bottom',
            labels: {
              font: {
                family: 'Arial',
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Répartition des entités sur la plateforme',
            font: {
              family: 'Arial',
              size: 18,
              weight: 'bold'
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      }
    });
  }

  // Méthode pour mettre à jour le graphique des formations les plus populaires
  updateTopFormationsChart() {
    // Exemple: supposons que chaque formation a un nombre de participants
    // Vous devrez adapter ceci en fonction de la structure réelle de vos données
    
    // Simulation: Assignons un nombre aléatoire de participants à chaque formation
    const formationStats = this.formations.map(formation => {
      return {
        nom: formation.titre || 'Formation sans titre',
        participants: Math.floor(Math.random() * 30) + 1 // Simuler un nombre de participants
      };
    });

    // Trier par nombre de participants
    const sortedFormations = formationStats.sort((a, b) => b.participants - a.participants);
    const topFormations = sortedFormations.slice(0, 5); // Prendre les 5 meilleures formations

    const labels = topFormations.map(f => f.nom);
    const data = topFormations.map(f => f.participants);

    // Définir un ensemble de couleurs différentes
    const colors = ['#4bc0c0', '#8B65D2', '#36a2eb', '#ffce56', '#9966ff'];

    const barChart = new Chart('topFormationsChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de participants',
          data: data,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top 5 des formations par nombre de participants',
            font: {
              family: 'Arial',
              size: 18,
              weight: 'bold'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                family: 'Arial',
                size: 14
              }
            }
          },
          x: {
            ticks: {
              font: {
                family: 'Arial',
                size: 14
              }
            }
          }
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      }
    });
  }
}