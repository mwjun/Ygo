/**
 * FILE: unsubscribed.ts
 * 
 * PURPOSE:
 * Component that displays unsubscribe confirmation message.
 * Shown after a user successfully unsubscribes from a newsletter via email link.
 * 
 * FEATURES:
 * - Displays confirmation message for successful unsubscribe
 * - Shows which newsletter was unsubscribed from (via query parameter)
 * - Retrieves newsletter name from configuration service
 * 
 * FLOW:
 * 1. Component receives 'type' query parameter (newsletter type: 'dl', 'md', or 'tcg')
 * 2. Looks up newsletter configuration to get display name
 * 3. Displays confirmation message with newsletter name
 * 
 * QUERY PARAMETERS:
 * - type: Newsletter type ('dl', 'md', or 'tcg') - indicates which newsletter was unsubscribed
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-unsubscribed',
  standalone: true,
  imports: [CommonModule, RouterModule, PageContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './unsubscribed.html',
  styleUrl: './unsubscribed.css'
})
export class UnsubscribedComponent implements OnInit {
  /**
   * Newsletter type from query parameter ('dl', 'md', or 'tcg')
   * Used to look up newsletter configuration
   */
  newsletterType: string = '';
  
  /**
   * Newsletter display name (e.g., "Yu-Gi-Oh! Duel Links")
   * Retrieved from NewsletterConfigService based on newsletterType
   */
  newsletterName: string = '';

  /**
   * Constructor - Dependency Injection
   * @param route - ActivatedRoute for accessing query parameters
   * @param newsletterConfig - Service for retrieving newsletter configuration
   */
  constructor(
    private route: ActivatedRoute,
    private newsletterConfig: NewsletterConfigService
  ) {}

  /**
   * Component initialization lifecycle hook
   * Reads 'type' query parameter and looks up newsletter name
   * 
   * LOGIC:
   * - Subscribes to route query parameters
   * - Extracts 'type' parameter (newsletter type)
   * - Looks up newsletter configuration to get display name
   * - Sets newsletterName for template display
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // Get newsletter type from query parameter (e.g., ?type=dl)
      this.newsletterType = params['type'] || '';
      
      // If newsletter type is provided, look up its display name
      if (this.newsletterType) {
        const config = this.newsletterConfig.getConfig(this.newsletterType as any);
        this.newsletterName = config.title;  // e.g., "Yu-Gi-Oh! Duel Links"
      }
    });
  }
}

