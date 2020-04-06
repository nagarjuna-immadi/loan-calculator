import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Installment } from '../models/installment';
import { LoanCalculatorService } from '../services/loan-calculator.service';

@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss']
})
export class LoanCalculatorComponent implements OnInit {

  calculatorForm: FormGroup;
  monthlyInstallment: number = 0;
  errorMessage: string = '';

  constructor(private calculator: LoanCalculatorService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.calculatorForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(10000), Validators.max(100000)]],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    this.calculatorForm.valueChanges.subscribe(values => {
      this.monthlyInstallment = 0;
      this.errorMessage = '';
    });
  }

  get amount() {
    return this.calculatorForm.get('amount');
  }

  get duration() {
    return this.calculatorForm.get('duration');
  }

  calculateInstallment() {
    this.calculator.getInstallment(this.calculatorForm.value)
      .subscribe((data: Installment) => {
        this.monthlyInstallment = data.monthlyInstallment;
      }, err => {
        this.errorMessage = `Failed to calculate installment. Please try after some time. Reason: ${err}`;
      });
  }

}
