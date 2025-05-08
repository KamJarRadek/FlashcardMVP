import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../auth/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { render, screen, fireEvent } from '@testing-library/angular';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
      ],
      declarations: [LoginFormComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('powinien utworzyć komponent', () => {
    expect(component).toBeTruthy();
  });

  it('powinien mieć niezatwierdzony formularz na początku', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('powinien walidować formularz poprawnie', () => {
    const emailControl = component.loginForm.controls['email'];
    const passwordControl = component.loginForm.controls['password'];

    // Niepoprawny email
    emailControl.setValue('niepoprawny-email');
    expect(emailControl.valid).toBeFalsy();

    // Poprawny email
    emailControl.setValue('poprawny@email.com');
    expect(emailControl.valid).toBeTruthy();

    // Za krótkie hasło
    passwordControl.setValue('123');
    expect(passwordControl.valid).toBeFalsy();

    // Poprawne hasło
    passwordControl.setValue('haslo123');
    expect(passwordControl.valid).toBeTruthy();
  });

  it('powinien wywołać AuthService.login po poprawnym wypełnieniu formularza', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('powinien wyświetlić komunikat błędu gdy logowanie nie powiedzie się', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Błąd logowania')));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');

    component.onSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Niepoprawny email lub hasło', 'Zamknij', jasmine.any(Object));
  });
});

// Alternatywny test z użyciem Angular Testing Library
describe('LoginFormComponent (ATL)', () => {
  const setup = async () => {
    const authServiceSpy = {
      login: jasmine.createSpy('login').and.returnValue(of({ token: 'fake-token' }))
    };

    return render(LoginFormComponent, {
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }
      ]
    });
  };

  it('powinien wypełnić formularz i wywołać login', async () => {
    const { fixture } = await setup();
    const authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    // Wypełnienie formularza
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/hasło/i), { target: { value: 'password123' } });

    // Kliknięcie przycisku logowania
    fireEvent.click(screen.getByRole('button', { name: /zaloguj/i }));

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
