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

      // Dans AuthComponent
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
          
          // Décoder le token pour obtenir les infos utilisateur
          const userDetails = this.service.userDetails();
          
          // Redirection selon le rôle
          if (userDetails.role === 'ADMIN') {
            this.router.navigate(['/home']);
          } else if (userDetails.role === 'MANAGER') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/listformation']);
          }

          this.toast.success({
            detail: 'Succès',
            summary: 'Connexion réussie!'
          });
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
