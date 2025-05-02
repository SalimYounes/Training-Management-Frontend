import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Employeur } from '../Entité/Employeur.module';

@Component({
  selector: 'app-add-employeur',
  templateUrl: './add-employeur.component.html',
  styleUrls: ['./add-employeur.component.css']
})
export class AddEmployeurComponent implements OnInit {
  employeurForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.employeurForm = this.fb.group({
      nomemployeur: ['', Validators.required]
    });
  }

  get nomemployeur() {
    return this.employeurForm.get('nomemployeur');
  }

  ngOnInit(): void {}

  addEmployeur() {
    if (this.employeurForm.invalid) {
      this.toast.info({ detail: 'Erreur', summary: 'Le nom de l\'employeur est obligatoire' });
      return;
    }

    const employeur = new Employeur(undefined, this.employeurForm.value.nomemployeur);

    this.service.addEmployeur(employeur).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Employeur ajouté avec succès' });
        this.router.navigate(['/listemployeur']);
      },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur serveur ou employeur déjà existant' });
        console.error(err);
      }
    });
  }
}
