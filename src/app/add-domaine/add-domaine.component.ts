import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Domaine } from '../Entité/Domaine.module';

@Component({
  selector: 'app-add-domaine',
  templateUrl: './add-domaine.component.html',
  styleUrls: ['./add-domaine.component.css']
})
export class AddDomaineComponent implements OnInit {
  domaineForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {
    this.domaineForm = this.fb.group({
      libelle: ['', Validators.required]
    });
  }

  get libelle() {
    return this.domaineForm.get('libelle');
  }

  ngOnInit(): void {}

  addDomaine() {
    if (this.domaineForm.invalid) {
      this.toast.info({ detail: 'Erreur', summary: 'Le libellé est obligatoire' });
      return;
    }

    const domaine = new Domaine(undefined, this.domaineForm.value.libelle);

    this.service.addDomaine(domaine).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Domaine ajouté avec succès' });
        this.router.navigate(['/listdomaine']);
      },
      error: (err) => {
        this.toast.error({ detail: 'Erreur', summary: 'Erreur serveur ou libellé existant' });
        console.error(err);
      }
    });
  }
}
