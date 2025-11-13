import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterConfigService } from '../../services/newsletter-config';
import { NewsletterType } from '../../models/newsletter-type';
import { CookieService } from '../../services/cookie';
import { SelectedCategories } from '../../services/cookie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  newsletters;
  selectedNewsletters: { [key: string]: boolean } = {
    'dl': false,
    'md': false,
    'tcg': false
  };

  constructor(
    private newsletterConfig: NewsletterConfigService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.newsletters = this.newsletterConfig.getAllConfigs();
  }

  ngOnInit(): void {
    // Check if age is verified
    if (!this.cookieService.isAgeVerified()) {
      this.router.navigate(['/']);
      return;
    }

    // Load previously selected categories from cookie
    const categories = this.cookieService.getSelectedCategories();
    if (categories) {
      this.selectedNewsletters['dl'] = categories.dl || false;
      this.selectedNewsletters['md'] = categories.md || false;
      this.selectedNewsletters['tcg'] = categories.tcg || false;
    }
  }

  toggleNewsletter(type: NewsletterType): void {
    this.selectedNewsletters[type] = !this.selectedNewsletters[type];
  }

  onContinue(): void {
    // Check if at least one newsletter is selected
    const hasSelected = this.selectedNewsletters['dl'] || 
                        this.selectedNewsletters['md'] || 
                        this.selectedNewsletters['tcg'];
    
    if (!hasSelected) {
      alert('Please select at least one newsletter to continue.');
      return;
    }

    // Update categories in cookie based on selected newsletters
    const updatedCategories: SelectedCategories = {
      dl: this.selectedNewsletters['dl'] || false,
      md: this.selectedNewsletters['md'] || false,
      tcg: this.selectedNewsletters['tcg'] || false
    };
    this.cookieService.setSelectedCategories(updatedCategories);

    // Navigate to the first selected newsletter signup page
    if (this.selectedNewsletters['dl']) {
      this.router.navigate(['/dl-signup']);
    } else if (this.selectedNewsletters['md']) {
      this.router.navigate(['/md-signup']);
    } else if (this.selectedNewsletters['tcg']) {
      this.router.navigate(['/tcg-signup']);
    }
  }
}
