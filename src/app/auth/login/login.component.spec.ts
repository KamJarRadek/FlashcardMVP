import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: { login: jest.Mock<Promise<any>> };
  let router: Router;

  beforeEach(async () => {
    authServiceMock = { login: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create component and form controls', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.contains('email')).toBe(true);
    expect(component.loginForm.contains('password')).toBe(true);
  });

  it('should have hidePassword default true', () => {
    expect(component.hidePassword).toBe(true);
  });

  it('should validate email control correctly', () => {
    const control = component.loginForm.get('email')!;
    control.setValue('');
    expect(control.valid).toBe(false);
    control.setValue('not-an-email');
    expect(control.valid).toBe(false);
    control.setValue('user@example.com');
    expect(control.valid).toBe(true);
  });

  it('should validate password control correctly', () => {
    const control = component.loginForm.get('password')!;
    control.setValue('');
    expect(control.valid).toBe(false);
    control.setValue('short');
    expect(control.valid).toBe(false);
    control.setValue('longenoughpassword');
    expect(control.valid).toBe(true);
  });

  it('should mark form touched and not submit when invalid', () => {
    const markTouchedSpy = jest.spyOn(component.loginForm, 'markAllAsTouched');
    component.loginForm.get('email')!.setValue('');
    component.loginForm.get('password')!.setValue('');
    component.onSubmit();
    expect(markTouchedSpy).toHaveBeenCalled();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should call login and navigate on successful login', async () => {
    const creds = { email: 'user@example.com', password: 'password123' };
    component.loginForm.setValue(creds);
    authServiceMock.login.mockResolvedValue({ token: 'token' });
    await component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalledWith(creds.email, creds.password);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.isLoading).toBe(false);
    expect(component.loginError).toBe('');
  });

  it('should handle login errors correctly', async () => {
    const creds = { email: 'user@example.com', password: 'password123' };
    component.loginForm.setValue(creds);
    const errorMsg = 'Invalid credentials';
    authServiceMock.login.mockRejectedValue(new Error(errorMsg));
    await component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalledWith(creds.email, creds.password);
    expect(component.isLoading).toBe(false);
    expect(component.loginError).toBe(errorMsg);
  });

  it('should handle login error and display error message', async () => {
    authServiceMock.login.mockRejectedValue(new Error('Invalid credentials'));

    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
    await component.onSubmit();

    expect(component.loginError).toBe('Invalid credentials');
    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
  });
});
