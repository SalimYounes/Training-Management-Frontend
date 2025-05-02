import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Employeur } from '../Entité/Employeur.module';

@Component({
  selector: 'app-update-employeur',
  templateUrl: './update-employeur.component.html',
  styleUrls: ['./update-employeur.component.css']
})
export class UpdateEmployeurComponent implements OnInit {

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
      nomemployeur: ['', [
        Validators.required,
        Validators.pattern("[a-zA-Z '-]+"),
        Validators.minLength(2),
      ]]
    });
  }

  get nomemployeur() { return this.updateForm.get('nomemployeur'); }

  ngOnInit(): void {
    let idEmployeur = this.router.snapshot.params['id'];
    this.id = idEmployeur;

    this.service.findEmployeurById(idEmployeur).subscribe({
      next: (employeur) => {
        this.updateForm.patchValue({
          nomemployeur: employeur.nomemployeur
        });
      },
      error: (err) => {
        console.error('Erreur chargement employeur:', err);
        this.toast.error({ detail: 'Erreur', summary: 'Erreur chargement employeur' });
        this.route.navigate(['/listemployeur']);
      }
    });
  }

  updateEmployeur() {
    if (this.updateForm.invalid) {
      this.toast.warning({
        detail: 'Formulaire invalide',
        summary: 'Veuillez corriger les erreurs',
      });
      return;
    }

    const formData = this.updateForm.value;

    const employeurToUpdate: Employeur = {
      id: this.id,
      nomemployeur: formData.nomemployeur
    };

    console.log('Employeur à mettre à jour:', JSON.stringify(employeurToUpdate, null, 2));

    this.service.updateEmployeur(this.id, employeurToUpdate).subscribe({
      next: (res) => {
        this.toast.success({
          detail: 'Succès',
          summary: 'Employeur mis à jour avec succès',
          duration: 3000
        });
        this.route.navigate(['/listemployeur']);
      },
      error: (err) => {
        console.error('Erreur complète:', err);
        
        let errorMessage = 'Échec de la mise à jour';
        if (err.status === 404) {
          errorMessage = 'Employeur non trouvé';
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
