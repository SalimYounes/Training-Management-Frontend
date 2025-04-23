import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmployeurComponent } from './list-employeur.component';

describe('ListEmployeurComponent', () => {
  let component: ListEmployeurComponent;
  let fixture: ComponentFixture<ListEmployeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEmployeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEmployeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
