import { TestBed } from '@angular/core/testing';

import { PubAdminServiceService } from './pub-admin-service.service';

describe('PubAdminServiceService', () => {
  let service: PubAdminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PubAdminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
