import { Component, OnInit } from '@angular/core';
import { Formation } from '../Entité/Formation.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-update-formation',
  templateUrl: './update-formation.component.html',
  styleUrls: ['./update-formation.component.css']
})
export class UpdateFormationComponent implements OnInit {
  updateForm: FormGroup;
  id: string;
  domaines: any[] = []; // Liste des domaines disponibles
  formateurs: any[] = []; // Liste des formateurs disponibles

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private route: Router,
    private router: ActivatedRoute,
    private toast: NgToastService
  ) {
    this.updateForm = this.fb.group({
      titre: ['', [
        Validators.required,
        Validators.minLength(2),
      ]],
      annee: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear() + 5)
      ]],
      duree: ['', [
        Validators.required,
        Validators.min(1)
      ]],
      budget: ['', [
        Validators.required,
        Validators.min(0)
      ]],
      domaine: [null, [Validators.required]],
      formateur: [null, [Validators.required]]
    });
  }

  get titre() { return this.updateForm.get('titre'); }
  get annee() { return this.updateForm.get('annee'); }
  get duree() { return this.updateForm.get('duree'); }
  get budget() { return this.updateForm.get('budget'); }
  get domaine() { return this.updateForm.get('domaine'); }
  get formateur() { return this.updateForm.get('formateur'); }

  ngOnInit(): void {
    // Charger domaines et formateurs
    this.service.getDomaines().subscribe(d => this.domaines = d);
    this.service.getFormateurs().subscribe(f => this.formateurs = f);

    // Charger la formation
    const idFormation = this.router.snapshot.params['id'];
    this.id = idFormation;
    this.service.findFormationById(idFormation).subscribe({
      next: (formation) => {
        console.log('Formation chargée:', formation);
        this.updateForm.patchValue({
          titre: formation.titre,
          annee: formation.annee,
          duree: formation.duree,
          budget: formation.budget,
          domaine: formation.domaine?.id,
          formateur: formation.formateur?.id
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.toast.error({
          detail: 'Erreur',
          summary: 'Échec du chargement de la formation',
        });
        this.route.navigate(['/listformation']);
      }
    });
  }

  updateFormation() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs dans le formulaire',
      });
      return;
    }

    const formData = this.updateForm.value;

    // Retrouver les objets complets
    const selectedDomaine = this.domaines.find(d => d.id === formData.domaine);
    const selectedFormateur = this.formateurs.find(f => f.id === formData.formateur);

    const formationToUpdate = {
      id: this.id,
      titre: formData.titre,
      annee: formData.annee,
      duree: formData.duree,
      budget: formData.budget,
      domaine: {
        id: selectedDomaine?.id,
        libelle: selectedDomaine?.libelle
      },
      formateur: {
        id: selectedFormateur?.id,
        nom: selectedFormateur?.nom,
        prenom: selectedFormateur?.prenom
      }
    };

    console.log('Formation à mettre à jour:', JSON.stringify(formationToUpdate, null, 2));

    this.service.updateFormation(this.id, formationToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Formation mise à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listformation']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Formation non trouvée';
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
