import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = { isAuthenticated$: of(true) };
    mockRouter = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should allow access when authenticated', (done) => {
    mockAuthService.isAuthenticated$ = of(true);

    TestBed.runInInjectionContext(() => {
      authGuard(null as any, null as any).subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done.fail
      });
    });
  });

  it('should redirect to /login when not authenticated', (done) => {
    mockAuthService.isAuthenticated$ = of(false);

    TestBed.runInInjectionContext(() => {
      authGuard(null as any, null as any).subscribe({
        next: (result) => {
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
          expect(result).toBe(false);
          done();
        },
        error: done.fail
      });
    });
  });
});
