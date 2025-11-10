import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newsletter-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './newsletter-logo.html',
  styleUrl: './newsletter-logo.css'
})
export class NewsletterLogoComponent {
  @Input() logoPath: string = '';
  @Input() altText: string = '';
}
