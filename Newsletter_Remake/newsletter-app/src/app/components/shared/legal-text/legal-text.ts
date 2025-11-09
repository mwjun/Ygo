import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-text',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-text.html',
  styleUrl: './legal-text.css'
})
export class LegalTextComponent {
  readonly privacyPolicyUrl = 'https://legal.konami.com/kdeus/privacy/en-us/';
  readonly termsOfUseUrl = 'https://legal.konami.com/kdeus/btob/terms/tou/en/';
}
