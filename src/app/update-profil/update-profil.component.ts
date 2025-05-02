import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Profil } from '../Entité/Profil.module'; // adapte le chemin si besoin

@Component({
  selector: 'app-update-profil',
  templateUrl: './update-profil.component.html',
  styleUrls: ['./update-profil.component.css']
})
export class UpdateProfilComponent implements OnInit {

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
    let idProfil = this.router.snapshot.params['id'];
    this.id = idProfil;

    this.service.findProfilById(idProfil).subscribe({
      next: (profil) => {
        this.updateForm.patchValue({
          libelle: profil.libelle
        });
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement profil' });
        this.route.navigate(['/listprofil']);
      }
    });
  }

  updateProfil() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs',
      });
      return;
    }

    const profilToUpdate: Profil = {
      id: this.id,
      libelle: this.updateForm.value.libelle
    };

    console.log('Profil à mettre à jour:', JSON.stringify(profilToUpdate, null, 2));

    this.service.updateProfil(this.id, profilToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Profil mis à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listprofil']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);

        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Profil non trouvé';
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
