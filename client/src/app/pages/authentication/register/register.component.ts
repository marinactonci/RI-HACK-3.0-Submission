import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { passwordValidator } from './password-validator';
import { AuthenticationService } from "../authentication.service";
import { matchPasswordValidator } from './match-password-validator';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from "primeng/styleclass";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, StyleClassModule, PasswordModule, ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  #fb: FormBuilder = inject(FormBuilder);
  #authenticationService: AuthenticationService = inject(AuthenticationService);
  registerForm: FormGroup;
  error: string = '';

  constructor() {
    this.registerForm = this.#fb.group(
      {
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, passwordValidator()]],
        confirmPassword: [null, Validators.required],
      },
      {
        validator: matchPasswordValidator('password', 'confirmPassword')
      }
    );
  }

  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) return;
    const payload = {
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };

    this.#authenticationService.register(payload).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }
}
