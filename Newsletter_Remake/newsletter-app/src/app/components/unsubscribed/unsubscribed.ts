import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsletterConfigService } from '../../services/newsletter-config';

@Component({
  selector: 'app-unsubscribed',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './unsubscribed.html',
  styleUrl: './unsubscribed.css'
})
export class UnsubscribedComponent implements OnInit {
  newsletterType: string = '';
  newsletterName: string = '';

  constructor(
    private route: ActivatedRoute,
    private newsletterConfig: NewsletterConfigService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.newsletterType = params['type'] || '';
      if (this.newsletterType) {
        const config = this.newsletterConfig.getConfig(this.newsletterType as any);
        this.newsletterName = config.title;
      }
    });
  }
}

