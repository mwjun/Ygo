import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewsletterConfigService } from '../../services/newsletter-config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  newsletters;

  constructor(private newsletterConfig: NewsletterConfigService) {
    this.newsletters = this.newsletterConfig.getAllConfigs();
  }
}
