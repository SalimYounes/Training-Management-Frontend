import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudserviceService } from '../service/crudservice.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  currentYear: number;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudserviceService,
    private router: Router,
    private toast: NgToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mp: ['', Validators.required]
    });
  }

  get email() { return this.loginForm.get('email'); }
  get mp() { return this.loginForm.get('mp'); }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  login() {
    if (this.loginForm.invalid) {
      this.toast.info({
        detail: 'Erreur',
        summary: 'Veuillez remplir correctement les champs.',
      });
      return;
    }
    
    const data = {
      email: this.email?.value,
      password: this.mp?.value
    };
    
    this.service.login(data).subscribe({
      next: (res: any) => {
        console.log('Response:', res);
        localStorage.setItem('myToken', res.token);
        
        let roleName = '';

        if (res.user) {
          localStorage.setItem('nom', res.user.nom || '');
          localStorage.setItem('prenom', res.user.prenom || '');
          localStorage.setItem('email', res.user.email || '');
          roleName = res.user.role?.nom || '';
          localStorage.setItem('roleName', roleName);
        } else {
          localStorage.setItem('nom', res.nom || '');
          localStorage.setItem('prenom', res.prenom || '');
          localStorage.setItem('email', res.email || '');
          roleName = res.roleName || '';
          localStorage.setItem('roleName', roleName);
        }
        
        // Redirection selon le rôle
        if (roleName === 'Administrateur') {
          this.router.navigate(['/home']);
        } else if (roleName === 'Responsable') {
          this.router.navigate(['/home']);
        } else { // Utilisateur simple
          this.router.navigate(['/listformation']);
        }

      },
      error: (error) => {
        if (error.status === 404) {
          this.toast.error({ detail: 'Erreur', summary: 'Utilisateur non trouvé.' });
        } else if (error.status === 401) {
          this.toast.error({ detail: 'Erreur', summary: 'Mot de passe incorrect.' });
        } else {
          this.toast.error({ detail: 'Erreur', summary: 'Erreur serveur.' });
        }
      }
    });
  }
}
