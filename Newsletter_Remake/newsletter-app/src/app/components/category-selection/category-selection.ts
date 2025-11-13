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
  selectedCategories: SelectedCategories = {
    dl: false,
    md: false,
    tcg: false
  };
  
  newsletters: Array<{ type: NewsletterType; title: string; logoPath: string }> = [];
  errorMessage: string = '';

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private newsletterConfig: NewsletterConfigService
  ) {}

  ngOnInit(): void {
    // Check if age is verified
    if (!this.cookieService.isAgeVerified()) {
      this.router.navigate(['/']);
      return;
    }

    // Load newsletter configs for category selection
    const configs = this.newsletterConfig.getAllConfigs();
    this.newsletters = configs.map(config => ({
      type: config.type,
      title: config.title,
      logoPath: config.logoPath
    }));
  }

  toggleCategory(type: NewsletterType): void {
    this.selectedCategories[type] = !this.selectedCategories[type];
    // Clear error message when user selects a category
    if (this.selectedCategories[type]) {
      this.errorMessage = '';
    }
  }

  onContinue(): void {
    // Check if at least one category is selected
    const hasSelectedCategory = this.selectedCategories.dl || 
                                this.selectedCategories.md || 
                                this.selectedCategories.tcg;
    
    if (!hasSelectedCategory) {
      this.errorMessage = 'Please select at least one category.';
      return;
    }

    // Store categories in cookie
    this.cookieService.setSelectedCategories(this.selectedCategories);
    
    // Redirect to home page (newsletter selection)
    this.router.navigate(['/home']);
  }
}

