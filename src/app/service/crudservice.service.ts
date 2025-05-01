import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../Entité/User.module';
import { Role } from '../Entité/Role.module';
import { Employeur } from '../Entité/Employeur.module';
import { Formateur } from '../Entité/Formateur.module';
import { Formation } from '../Entité/Formation.module';
import { Participant } from '../Entité/Participant.module';
import { Structure } from '../Entité/Structure.module';
import { Profil } from '../Entité/Profil.module';
import { Domaine } from '../Entité/Domaine.module';

@Injectable({
  providedIn: 'root'
})
export class CrudserviceService {
  apiUrl = "http://localhost:8080";
  helper = new JwtHelperService();

  constructor(private http: HttpClient) { }



  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, data);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem("myToken");
    return token ? true : false;
  }

  register(userData: any): Observable<any> {
    // Valider l'email avant envoi
    if (!this.validateEmail(userData.email)) {
      return throwError(() => new Error('Email invalide'));
    }
  
    const requestData = {
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'SIMPLE' // Rôle par défaut
    };
  
    return this.http.post(`${this.apiUrl}/auth/register`, requestData).pipe(
      catchError(error => {
        let errorMsg = 'Erreur lors de l\'inscription';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 400) {
          errorMsg = 'Données invalides';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  
  

  // User
  addUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  onDeleteUser(id: string): Observable<any> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.delete(url);
  }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  findUserById(id: string): Observable<User> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.get<User>(url);
  }

  updateUser(id: string, user: User): Observable<any> {
    const url = `${this.apiUrl}/users/${id}`;
    return this.http.put<any>(url, user);
  }

  // Role
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  onDeleteRole(id: string): Observable<any> {
    const url = `${this.apiUrl}/roles/${id}`;
    return this.http.delete(url);
  }


  // Employeur
  addEmployeur(employeur: Employeur): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/employeurs`, employeur);
  }

  onDeleteEmployeur(id: string): Observable<any> {
    const url = `${this.apiUrl}/employeurs/${id}`;
    return this.http.delete(url);
  }

  getEmployeurs(): Observable<Employeur[]> {
    return this.http.get<Employeur[]>(`${this.apiUrl}/employeurs`);
  }

  // Formateur
  addFormateur(formateur: Formateur): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formateurs`, formateur);
  }

  onDeleteFormateur(id: string): Observable<any> {
    const url = `${this.apiUrl}/formateurs/${id}`;
    return this.http.delete(url);
  }

  getFormateurs(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(`${this.apiUrl}/formateurs`);
  }

  // Formation
  addFormation(formation: Formation): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/formations`, formation);
  }

  onDeleteFormation(id: string): Observable<any> {
    const url = `${this.apiUrl}/formations/${id}`;
    return this.http.delete(url);
  }

  getFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.apiUrl}/formations`);
  }

  // Participant
  addParticipant(participant: Participant): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/participants`, participant);
  }

  onDeleteParticipant(id: string): Observable<any> {
    const url = `${this.apiUrl}/participants/${id}`;
    return this.http.delete(url);
  }

  getParticipants(): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.apiUrl}/participants`);
  }

  // Structure
  addStructure(structure: Structure): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/structures`, structure);
  }

  onDeleteStructure(id: string): Observable<any> {
    const url = `${this.apiUrl}/structures/${id}`;
    return this.http.delete(url);
  }

  getStructures(): Observable<Structure[]> {
    return this.http.get<Structure[]>(`${this.apiUrl}/structures`);
  }

  // Profil
  addProfil(profil: Profil): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profils`, profil);
  }

  onDeleteProfil(id: string): Observable<any> {
    const url = `${this.apiUrl}/profils/${id}`;
    return this.http.delete(url);
  }

  getProfils(): Observable<Profil[]> {
    return this.http.get<Profil[]>(`${this.apiUrl}/profils`);
  }

   // Domaine
   addDomaine(domaine: Domaine): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/domaines`, domaine);
  }

  onDeleteDomaine(id: string): Observable<any> {
    const url = `${this.apiUrl}/domaines/${id}`;
    return this.http.delete(url);
  }

  getDomaines(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(`${this.apiUrl}/domaines`);
  }
  
  // Authentication
 
// Dans CrudserviceService
userDetails(): any {
    const token: any = localStorage.getItem('myToken');
    if (!token) return null;
    
    try {
      const decodeToken = this.helper.decodeToken(token);
      console.log('Token expires at:', new Date(decodeToken.exp * 1000));
      return {
        id: decodeToken.sub,
        username: decodeToken.username,
        nom: decodeToken.nom,
        email: decodeToken.email,
        role: decodeToken.role
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

isAdmin(): boolean {
  const user = this.userDetails();
  return user?.role === 'ADMIN';
}

isManager(): boolean {
  const user = this.userDetails();
  return user?.role === 'MANAGER';
}

  
  logoutFromServer(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/logout`, {});
  }
  
  

  validateEmail(email: string): boolean {
    const regex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
}
function throwError(arg0: () => Error): Observable<any> {
  throw new Error('Function not implemented.');
}

