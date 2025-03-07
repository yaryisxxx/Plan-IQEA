import { TestBed } from '@angular/core/testing';

import { MateriasService } from './firestore.service';

describe('FirestoreService', () => {
  let service: MateriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MateriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
