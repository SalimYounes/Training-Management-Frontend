import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Structure } from '../Entité/Structure.module';
import { CrudserviceService } from '../service/crudservice.service';

@Component({
  selector: 'app-update-structure',
  templateUrl: './update-structure.component.html',
  styleUrls: ['./update-structure.component.css']
})
export class UpdateStructureComponent implements OnInit {
  updateForm: FormGroup;
  id: string;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private route: Router,
    private router: ActivatedRoute,
    private toast: NgToastService
  ) {
    // Initialisation du formulaire avec les validations de base pour libelle
    this.updateForm = this.fb.group({
      libelle: ['', [
        Validators.required,
        Validators.minLength(2)
      ]]
    });
  }

  // Getter pour accéder facilement au contrôle 'libelle'
  get libelle() {
    return this.updateForm.get('libelle');
  }

  ngOnInit(): void {
    // Récupération de l'ID de la structure depuis l'URL
    const idStructure = this.router.snapshot.params['id'];
    this.id = idStructure;
    
    // Chargement de la structure existante via le service
    this.service.findStructureById(idStructure).subscribe({
      next: (structure: Structure) => {
        console.log('Structure chargée:', structure);
        // Remplissage du formulaire avec les données récupérées
        this.updateForm.patchValue({
          libelle: structure.libelle
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.toast.error({
          detail: 'Erreur',
          summary: 'Échec du chargement des données de la structure',
          duration: 5000
        });
        this.route.navigate(['/liststructure']);
      }
    });
  }

  // Méthode de modification de la structure
  updateStructure() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs dans le formulaire',
        duration: 5000
      });
      return;
    }

    // Création de l'objet Structure à partir des valeurs du formulaire
    const updatedStructure: Structure = {
      id: this.id,
      libelle: this.updateForm.value.libelle
    };

    console.log('Structure à mettre à jour:', JSON.stringify(updatedStructure, null, 2));

    // Appel du service pour mettre à jour la structure
    this.service.updateStructure(this.id, updatedStructure).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Structure mise à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/liststructure']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Structure non trouvée';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.toast.error({
          detail: 'Erreur ' + err.status,
          summary: errorMessage,
          duration: 5000
        });
      }
    });
  }
}
