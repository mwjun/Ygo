/**
 * FILE: category-selection.ts
 * 
 * PURPOSE:
 * Component for selecting newsletter categories (currently unused but kept for future use).
 * This component allows users to select which newsletters they want to subscribe to.
 * 
 * FEATURES:
 * - Newsletter category selection (Duel Links, Master Duel, TCG)
 * - Age verification check
 * - Cookie-based category storage
 * - Validation (at least one category must be selected)
 * 
 * NOTE:
 * This component is currently not used in the main flow.
 * The home component now handles category selection directly.
 * This component is kept for potential future use or alternative flows.
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from '../../services/cookie';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { NewsletterType } from '../../models/newsletter-type';
import { SelectedCategories } from '../../services/cookie';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-category-selection',
  standalone: true,
  imports: [
    CommonModule,
    PageContainerComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './category-selection.html',
  styleUrl: './category-selection.css'
})
export class CategorySelectionComponent implements OnInit {
  /**
   * Object tracking which newsletter categories are selected
   * Keys: 'dl', 'md', 'tcg'
   * Values: boolean (true if selected)
   */
  selectedCategories: SelectedCategories = {
    dl: false,
    md: false,
    tcg: false
  };
  
  /**
   * Array of newsletter configurations for display
   * Contains type, title, and logoPath for each newsletter
   */
  newsletters: Array<{ type: NewsletterType; title: string; logoPath: string }> = [];
  
  /**
   * Error message to display if validation fails
   * Shown when user tries to continue without selecting any category
   */
  errorMessage: string = '';

  /**
   * Constructor - Dependency Injection
   * @param cookieService - Service for managing cookies and age verification
   * @param router - Angular router for navigation
   * @param newsletterConfig - Service for retrieving newsletter configurations
   */
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private newsletterConfig: NewsletterConfigService
  ) {}

  /**
   * Component initialization lifecycle hook
   * Checks age verification and loads newsletter configurations
   * 
   * LOGIC:
   * - Checks if user has passed age verification
   * - If not verified, redirects to age gate
   * - Loads all newsletter configurations for category selection
   */
  ngOnInit(): void {
    // Check if age is verified - redirect to age gate if not
    if (!this.cookieService.isAgeVerified()) {
      this.router.navigate(['/']);
      return;
    }

    // Load newsletter configs for category selection
    // Gets all available newsletters (Duel Links, Master Duel, TCG)
    const configs = this.newsletterConfig.getAllConfigs();
    this.newsletters = configs.map(config => ({
      type: config.type,
      title: config.title,
      logoPath: config.logoPath
    }));
  }

  /**
   * Toggle newsletter category selection
   * Called when user clicks on a newsletter category
   * 
   * @param type - Newsletter type to toggle ('dl', 'md', or 'tcg')
   */
  toggleCategory(type: NewsletterType): void {
    this.selectedCategories[type] = !this.selectedCategories[type];
    // Clear error message when user selects a category (provides immediate feedback)
    if (this.selectedCategories[type]) {
      this.errorMessage = '';
    }
  }

  /**
   * Handler for "Continue" button click
   * Validates that at least one category is selected, then stores selection and navigates
   * 
   * VALIDATION:
   * - Checks if at least one newsletter category is selected
   * - Shows error message if no categories selected
   * 
   * ACTIONS:
   * - Stores selected categories in cookie
   * - Redirects to home page for newsletter signup
   */
  onContinue(): void {
    // Check if at least one category is selected
    const hasSelectedCategory = this.selectedCategories.dl || 
                                this.selectedCategories.md || 
                                this.selectedCategories.tcg;
    
    if (!hasSelectedCategory) {
      this.errorMessage = 'Please select at least one category.';
      return;
    }

    // Store categories in cookie (expires in 2 hours)
    this.cookieService.setSelectedCategories(this.selectedCategories);
    
    // Redirect to home page (newsletter signup page)
    this.router.navigate(['/home']);
  }
}

