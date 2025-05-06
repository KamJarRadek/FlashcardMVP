import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  public showSuccess(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['snackbar-success']
    });
  }

  public showError(message: string, action: string = 'OK', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['snackbar-error']
    });
  }
}
