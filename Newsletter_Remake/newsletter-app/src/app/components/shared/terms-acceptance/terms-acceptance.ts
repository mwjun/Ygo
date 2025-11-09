import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-terms-acceptance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terms-acceptance.html',
  styleUrl: './terms-acceptance.css'
})
export class TermsAcceptanceComponent {
  @Output() termsAccepted = new EventEmitter<void>();
  @Output() termsDeclined = new EventEmitter<void>();
  
  accepted: boolean = false;
  
  readonly privacyPolicyUrl = 'https://legal.konami.com/kdeus/privacy/en-us/';
  readonly termsOfUseUrl = 'https://legal.konami.com/kdeus/btob/terms/tou/en/';

  onAccept(): void {
    if (this.accepted) {
      this.termsAccepted.emit();
    }
  }

  onDecline(): void {
    this.termsDeclined.emit();
  }
}

