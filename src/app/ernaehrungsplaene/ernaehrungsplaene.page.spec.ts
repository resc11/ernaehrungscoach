import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErnaehrungsplaenePage } from './ernaehrungsplaene.page';

describe('ErnaehrungsplaenePage', () => {
  let component: ErnaehrungsplaenePage;
  let fixture: ComponentFixture<ErnaehrungsplaenePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErnaehrungsplaenePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
