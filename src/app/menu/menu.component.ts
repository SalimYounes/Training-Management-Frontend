import { Component, OnInit } from '@angular/core';
import { CrudserviceService } from '../service/crudservice.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  currentUser: any = null;
  
  constructor(private service: CrudserviceService) { }
  
  ngOnInit(): void {
    this.currentUser = this.service.userDetails();
  }
  
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
  
  isSimpleUser(): boolean {
    return !this.hasRole('ADMIN') && !this.hasRole('MANAGER');
  }
}