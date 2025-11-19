/**
 * FILE: error.ts
 * 
 * PURPOSE:
 * Error page component that displays "Access Denied" message.
 * Shown when users fail age verification (under 16) or try to access protected routes without age verification.
 * 
 * FEATURES:
 * - Displays "Access Denied" message
 * - Simple, clear error messaging
 * - Consistent page layout (header, footer, page container)
 * - Scrolls to top on component initialization
 * 
 * USAGE:
 * - Redirected from age gate when user is under 16
 * - Redirected from protected routes when age verification cookie is missing
 * 
 * NOTE:
 * ViewEncapsulation.None is used to allow global styles to apply to this component
 */
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageContainerComponent } from '../shared/page-container/page-container';
import { HeaderComponent } from '../shared/header/header';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, PageContainerComponent, HeaderComponent, FooterComponent],
  templateUrl: './error.html',
  styleUrl: './error.css',
  encapsulation: ViewEncapsulation.None  // Allows global styles to apply to this component
})
export class ErrorComponent implements OnInit {
  /**
   * Component initialization lifecycle hook
   * Scrolls page to top to ensure user starts at the top of the page
   */
  ngOnInit(): void {
    // Scroll to top of page when component loads
    window.scrollTo(0, 0);
  }
}
