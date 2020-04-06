import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoanCalculatorComponent } from './loan-calculator.component';
import { LoanCalculatorService } from '../services/loan-calculator.service';

describe('LoanCalculatorComponent', () => {
  let component: LoanCalculatorComponent;
  let fixture: ComponentFixture<LoanCalculatorComponent>;
  let LoanCalculatorServiceSpy: any;

  beforeEach(async(() => {
    LoanCalculatorServiceSpy = jasmine.createSpyObj('LoanCalculatorService', ['getInstallment']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule, ReactiveFormsModule],
      declarations: [ LoanCalculatorComponent ],
      providers: [
        { provide: LoanCalculatorService, useValue: LoanCalculatorServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculator form should be created', () => {
    expect(component.calculatorForm).toBeTruthy();
  });

  it('Monthly installment and Error message should be cleared on updaing form fields', () => {
    component.errorMessage = 'Some error message';
    component.monthlyInstallment = 5000.00;
    component.calculatorForm.patchValue({
      duration: 3
    });

    expect(component.errorMessage).toBe('');
    expect(component.monthlyInstallment).toBe(0);
  });

  it('Should update montly installment on successful calculation', () => {
    const res = {"amount":10000.00,"duration":5,"monthlyInstallment":5390.61};
    LoanCalculatorServiceSpy.getInstallment.and.returnValue(of(res));
    component.calculatorForm.setValue({amount:10000, duration:5});

    component.calculateInstallment();
    expect(component.monthlyInstallment).toEqual(res.monthlyInstallment);
  });

  it('Should update error message on failed calculation', () => {
    const errMsg = '404 - Not Found';
    component.calculatorForm.setValue({amount:10000, duration:5});
    LoanCalculatorServiceSpy.getInstallment.and.returnValue(throwError(errMsg));

    component.calculateInstallment();
    expect(component.errorMessage).toContain(errMsg);
  });

});
