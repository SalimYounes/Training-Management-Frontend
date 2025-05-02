import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Profil } from '../Entité/Profil.module';

@Component({
  selector: 'app-add-profil',
  templateUrl: './add-profil.component.html',
  styleUrls: ['./add-profil.component.css']
})
export class AddProfilComponent implements OnInit {
  profilForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.profilForm = this.fb.group({
      libelle: ['', Validators.required]
    });
  }

  get libelle() {
    return this.profilForm.get('libelle');
  }

  ngOnInit(): void {}

  addProfil() {
    if (this.profilForm.invalid) {
      this.toast.info({ detail: 'Erreur', summary: 'Le libellé du profil est obligatoire' });
      return;
    }

    const profil = new Profil(undefined, this.profilForm.value.libelle);

    this.service.addProfil(profil).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Profil ajouté avec succès' });
        this.router.navigate(['/listprofil']);
      },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur serveur ou profil déjà existant' });
        console.error(err);
      }
    });
  }
}
