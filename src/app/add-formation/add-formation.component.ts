import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Formation } from '../Entité/Formation.module';
import { Domaine } from '../Entité/Domaine.module';
import { Formateur } from '../Entité/Formateur.module';

@Component({
  selector: 'app-add-formation',
  templateUrl: './add-formation.component.html',
  styleUrls: ['./add-formation.component.css']
})
export class AddFormationComponent implements OnInit {
  formationForm: FormGroup;
  domaines: Domaine[] = [];
  formateurs: Formateur[] = [];

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.formationForm = this.fb.group({
      titre: ['', Validators.required],
      annee: ['', [Validators.required, Validators.min(2000)]],
      duree: ['', [Validators.required, Validators.min(1)]],
      budget: ['', [Validators.required, Validators.min(0)]],
      domaine: ['', Validators.required],
      formateur: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.service.getDomaines().subscribe({
      next: (res) => this.domaines = res,
      error: (err) => console.error('Erreur chargement des domaines', err)
    });

    this.service.getFormateurs().subscribe({
      next: (res) => this.formateurs = res,
      error: (err) => console.error('Erreur chargement des formateurs', err)
    });
  }

  addFormation() {
    if (this.formationForm.invalid) {
      this.toast.info({ detail: 'Erreur', summary: 'Tous les champs sont obligatoires' });
      return;
    }

    const formData = this.formationForm.value;
    const formation = new Formation(
      undefined,
      formData.titre,
      formData.annee,
      formData.duree,
      formData.budget,
      formData.domaine,
      formData.formateur
    );

    this.service.addFormation(formation).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Formation ajoutée avec succès' });
        this.router.navigate(['/listformation']);
      },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur lors de l\'ajout de la formation' });
        console.error(err);
      }
    });
  }
}
