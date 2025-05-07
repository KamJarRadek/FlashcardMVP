import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  token: string | null = null;
  resetComplete = false;
  tokenValid = true;
  isLoading = false;
  resetError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');

    // Sprawdź czy token istnieje w parametrach URL
    this.tokenValid = !!this.token;

    if (!this.tokenValid) {
      this.resetError = 'Nieprawidłowy lub wygasły token resetowania hasła.';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.valid && this.token) {
      this.isLoading = true;
      this.resetError = '';

      try {
        const { password } = this.resetPasswordForm.value;
        const response = await this.authService.updatePassword(password, this.token);

        this.resetComplete = true;

        // Przekieruj do strony logowania po 2 sekundach
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } catch (error: any) {
        console.error('Błąd resetowania hasła:', error);
        this.resetError = error.message || 'Wystąpił błąd podczas resetowania hasła. Spróbuj ponownie.';
      } finally {
        this.isLoading = false;
      }
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}
