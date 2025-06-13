import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('authGuard', () => {
  it('should allow access when authenticated', (done) => {
    const mockAuthService = { isAuthenticated$: of(true) };
    const mockRouter = { navigate: jest.fn() };

    authGuard({} as any, {} as any, {
      inject: (token: any) => token === AuthService ? mockAuthService : mockRouter
    } as any).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to /login when not authenticated', (done) => {
    const mockAuthService = { isAuthenticated$: of(false) };
    const mockRouter = { navigate: jest.fn() };

    authGuard({} as any, {} as any, {
      inject: (token: any) => token === AuthService ? mockAuthService : mockRouter
    } as any).subscribe(result => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(result).toBe(false);
      done();
    });
  });
});
