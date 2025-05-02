import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { Structure } from '../Entité/Structure.module';

@Component({
  selector: 'app-add-structure',
  templateUrl: './add-structure.component.html',
  styleUrls: ['./add-structure.component.css']
})
export class AddStructureComponent implements OnInit {
  structureForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.structureForm = this.fb.group({
      libelle: ['', Validators.required]
    });
  }

  addStructure() {
    if (this.structureForm.invalid) {
      this.toast.warning({ detail: 'Champs requis', summary: 'Le libellé est obligatoire' });
      return;
    }

    const structure = new Structure(undefined, this.structureForm.value.libelle);

    this.service.addStructure(structure).subscribe({
      next: () => {
        this.toast.success({ detail: 'Succès', summary: 'Structure ajoutée avec succès' });
        this.router.navigate(['/liststructure']);
      },
      error: () => {
        this.toast.error({ detail: 'Erreur', summary: 'Échec de l\'ajout' });
      }
    });
  }
}
