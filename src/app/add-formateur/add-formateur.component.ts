import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Formateur } from '../Entité/Formateur.module';
import { Employeur } from '../Entité/Employeur.module';
import { User } from '../Entité/User.module';

@Component({
  selector: 'app-add-formateur',
  templateUrl: './add-formateur.component.html',
  styleUrls: ['./add-formateur.component.css']
})
export class AddFormateurComponent implements OnInit {
  formateurForm: FormGroup;
  employeurs: Employeur[] = [];
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.formateurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validation pour un numéro de téléphone à 10 chiffres
      type: ['', Validators.required],
      employeur: ['', Validators.required],
      user: ['', Validators.required]
    });
  }

  get nom() { return this.formateurForm.get('nom'); }
  get prenom() { return this.formateurForm.get('prenom'); }
  get email() { return this.formateurForm.get('email'); }
  get tel() { return this.formateurForm.get('tel'); }
  get type() { return this.formateurForm.get('type'); }
  get employeur() { return this.formateurForm.get('employeur'); }
  get user() { return this.formateurForm.get('user'); }

  ngOnInit(): void {
    // Chargement des employeurs et utilisateurs pour les associer à ce formateur
    this.service.getEmployeurs().subscribe(
      (res) => this.employeurs = res,
      (err) => console.error('Erreur chargement des employeurs', err)
    );

    this.service.getUser().subscribe(
      (res) => this.users = res,
      (err) => console.error('Erreur chargement des utilisateurs', err)
    );
  }

  addFormateur() {
    if (this.formateurForm.invalid) {
      this.toast.info({ detail: 'Erreur', summary: 'Tous les champs sont obligatoires' });
      return;
    }

    const formData = this.formateurForm.value;
    const formateur = new Formateur(
      undefined,
      formData.nom,
      formData.prenom,
      formData.email,
      formData.tel,
      formData.type,
      formData.employeur,
      formData.user
    );

    this.service.addFormateur(formateur).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Formateur ajouté avec succès' });
        this.router.navigate(['/listformateur']);
      },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur lors de l\'ajout du formateur' });
        console.error(err);
      }
    });
  }
}
