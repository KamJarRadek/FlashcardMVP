import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('powinien być utworzony', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('powinien zapisać token po udanym logowaniu', () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: '1', email: 'test@example.com' }
      };

      service.login('test@example.com', 'password123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('supabase.auth.token')).toEqual(mockResponse.token);
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('powinien przekierować użytkownika po udanym logowaniu', () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        user: { id: '1', email: 'test@example.com' }
      };

      service.login('test@example.com', 'password123').subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('powinien zwrócić true jeśli token istnieje', () => {
      localStorage.setItem('supabase.auth.token', 'fake-jwt-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('powinien zwrócić false jeśli token nie istnieje', () => {
      localStorage.removeItem('supabase.auth.token');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('logout', () => {
    it('powinien usunąć token i przekierować do logowania', () => {
      localStorage.setItem('supabase.auth.token', 'fake-jwt-token');

      service.logout();

      expect(localStorage.getItem('supabase.auth.token')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
