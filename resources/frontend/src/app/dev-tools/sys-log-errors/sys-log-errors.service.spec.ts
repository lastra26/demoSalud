import { TestBed } from '@angular/core/testing';

import { SysLogErrorsService } from './sys-log-errors.service';

describe('SysLogErrorsService', () => {
  let service: SysLogErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysLogErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
