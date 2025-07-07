import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FortschrittPage } from './fortschritt.page';

describe('FortschrittPage', () => {
  let component: FortschrittPage;
  let fixture: ComponentFixture<FortschrittPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FortschrittPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
