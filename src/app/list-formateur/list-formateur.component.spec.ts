import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormateurComponent } from './list-formateur.component';

describe('ListFormateurComponent', () => {
  let component: ListFormateurComponent;
  let fixture: ComponentFixture<ListFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
