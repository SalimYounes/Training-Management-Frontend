import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Domaine } from '../Entité/Domaine.module'; // adapte le chemin si besoin

@Component({
  selector: 'app-update-domaine',
  templateUrl: './update-domaine.component.html',
  styleUrls: ['./update-domaine.component.css']
})
export class UpdateDomaineComponent implements OnInit {

  updateForm: FormGroup;
  id: string;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private route: Router,
    private router: ActivatedRoute,
    private toast: NgToastService
  ) {
    this.updateForm = this.fb.group({
      libelle: ['', [
        Validators.required,
        Validators.pattern("[a-zA-Z '-]+"),
        Validators.minLength(2)
      ]]
    });
  }

  get libelle() {
    return this.updateForm.get('libelle');
  }

  ngOnInit(): void {
    let idDomaine = this.router.snapshot.params['id'];
    this.id = idDomaine;

    // Charger domaine
    this.service.findDomaineById(idDomaine).subscribe({
      next: (domaine) => {
        this.updateForm.patchValue({
          libelle: domaine.libelle
        });
      },
      error: (err) => {
        console.error('Erreur chargement domaine:', err);
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement domaine' });
        this.route.navigate(['/listdomaine']);
      }
    });
  }

  updateDomaine() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs',
      });
      return;
    }

    const domaineToUpdate: Domaine = {
      id: this.id,
      libelle: this.updateForm.value.libelle
    };

    console.log('Domaine à mettre à jour:', JSON.stringify(domaineToUpdate, null, 2));

    this.service.updateDomaine(this.id, domaineToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Domaine mis à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listdomaine']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);

        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Domaine non trouvé';
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
