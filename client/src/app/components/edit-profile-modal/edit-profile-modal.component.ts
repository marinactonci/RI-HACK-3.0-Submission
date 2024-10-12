import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../model/user.model';
import { SaveButtonComponent } from '../buttons/save-button/save-button.component';
import { CloseButtonComponent } from '../buttons/close-button/close-button.component';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [FormsModule, SaveButtonComponent, CloseButtonComponent],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss',
})
export class EditProfileModalComponent implements OnInit {
  user = input.required<any>();
  updateUser = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: '',
    image: '',
  };
  closeModal = output();

  ngOnInit(): void {
    this.updateUser = {
      firstName: this.user().user.firstName,
      lastName: this.user().user.lastName,
      email: this.user().user.email,
      phone: this.user().user.phone,
      description: this.user().user.description,
      image: this.user().user.image,
    };
  }

  saveChanges() {
    this.closeModal.emit();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.updateUser.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  closeEditModal() {
    this.closeModal.emit();
  }
}