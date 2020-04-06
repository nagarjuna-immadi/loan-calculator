import { TestBed, flush, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoanCalculatorService } from './loan-calculator.service';

describe('LoanCalculatorService', () => {
  let service: LoanCalculatorService;
  let httpTestingController: HttpTestingController;
  const apiUrl = 'assets/mock-data.json';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoanCalculatorService]
    });

    service = TestBed.inject(LoanCalculatorService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call server to get installment with no query params', () => {
    let payload = {};
    service.getInstallment(payload).subscribe();

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should call server to get installment with query params', () => {
    let payload = {amount:10000, duration:5};
    service.getInstallment(payload).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}?amount=10000&duration=5`);
    expect(req.request.method).toBe('GET');
  });

  it('Installment details should be returned on successful server call', fakeAsync(() => {
    const payload = {};
    const response = {"amount":10000.00,"duration":5,"monthlyInstallment":5390.61};
    service.getInstallment(payload).subscribe(data => {
      expect(data).toBe(response);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(response);
    flush();
  }));

  it('Error should be returned on failed server call', fakeAsync(() => {
    const payload = {};
    const error = {"status":404,"statusText":'Not Found'};
    service.getInstallment(payload).subscribe(() => {}, err => {
      expect(err).toBe('404 - Not Found');
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush('Call Failed', error);
    flush();
  }));
});
