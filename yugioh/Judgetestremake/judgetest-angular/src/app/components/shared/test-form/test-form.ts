import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TestUser } from '../../../models/test.model';

/**
 * TestForm Component
 * Single Responsibility: Handle user information input
 * Reusable: Can be used by any test page
 * Loosely Coupled: Emits events, doesn't manipulate parent state directly
 * Highly Cohesive: All functionality relates to user info collection
 */
@Component({
  selector: 'app-test-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './test-form.html',
  styleUrl: './test-form.scss'
})
export class TestFormComponent {
  @Input() idLabel: string = 'Card Game ID';
  @Output() formValidityChange = new EventEmitter<boolean>();
  @Output() userDataChange = new EventEmitter<TestUser>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cardGameId: ['', Validators.required]
    });

    // Emit form validity and data changes
    this.userForm.statusChanges.subscribe(() => {
      this.formValidityChange.emit(this.userForm.valid);
      if (this.userForm.valid) {
        this.emitUserData();
      }
    });

    this.userForm.valueChanges.subscribe(() => {
      if (this.userForm.valid) {
        this.emitUserData();
      }
    });
  }

  private emitUserData(): void {
    const formValue = this.userForm.value;
    const userData: TestUser = {
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      cardGameId: formValue.cardGameId
    };
    this.userDataChange.emit(userData);
  }

  /**
   * Public method to check form validity
   */
  isValid(): boolean {
    return this.userForm.valid;
  }

  /**
   * Public method to get user data
   */
  getUserData(): TestUser | null {
    if (!this.userForm.valid) {
      return null;
    }
    const formValue = this.userForm.value;
    return {
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      cardGameId: formValue.cardGameId
    };
  }

  /**
   * Mark all fields as touched to show validation errors
   */
  markAllAsTouched(): void {
    this.userForm.markAllAsTouched();
  }
}
