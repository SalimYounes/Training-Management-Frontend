import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toast: NgToastService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('myToken');
    
    // Ajouter le token aux requêtes
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.handleUnauthorizedError();
        } else if (error.status === 403) {
          this.handleForbiddenError();
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(): void {
    this.toast.error({
      detail: 'Session expirée',
      summary: 'Veuillez vous reconnecter',
      duration: 5000
    });
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  private handleForbiddenError(): void {
    this.toast.error({
      detail: 'Accès refusé',
      summary: "Vous n'avez pas les permissions nécessaires",
      duration: 5000
    });
  }
}