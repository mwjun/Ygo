import { Injectable } from '@angular/core';
import { NewsletterConfig, NewsletterType } from '../models/newsletter-type';

@Injectable({
  providedIn: 'root'
})
export class NewsletterConfigService {
  private readonly configs: Record<NewsletterType, NewsletterConfig> = {
    dl: {
      type: 'dl',
      title: 'Yu-Gi-Oh! Duel Links',
      logoPath: 'assets/dl-signup/img/Duel-Links-225x120.png',
      formUrl: 'https://cdn.forms-content-1.sg-form.com/22cdc575-1867-11ef-a74f-6e96bce0832b',
      routePath: '/home'
    },
    md: {
      type: 'md',
      title: 'Yu-Gi-Oh! Master Duel',
      logoPath: 'assets/md-signup/img/MD_logo_225x110.png',
      formUrl: 'https://cdn.forms-content-1.sg-form.com/b0cde6b5-1866-11ef-b7eb-dea4d84223eb',
      routePath: '/home'
    },
    tcg: {
      type: 'tcg',
      title: 'Yu-Gi-Oh! Trading Card Game',
      logoPath: 'assets/tcg-signup/img/TCG_logo_225x100.png',
      formUrl: 'https://cdn.forms-content-1.sg-form.com/422b389d-1864-11ef-9523-4ecf2d6389b9',
      routePath: '/home'
    }
  };

  getConfig(type: NewsletterType): NewsletterConfig {
    return this.configs[type];
  }

  getAllConfigs(): NewsletterConfig[] {
    return Object.values(this.configs);
  }

  getTypeFromRoute(route: string): NewsletterType | null {
    // Since individual signup pages are removed, default to 'dl' for any non-root route
    // This method is mainly used for determining newsletter type from URL
    if (route === '/' || route === '' || !route || route.trim() === '') {
      return null;
    }
    // Default to 'dl' for any other route (legacy support)
    return 'dl';
  }
}
