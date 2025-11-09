import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * TestFooter Component
 * Single Responsibility: Display footer links for test pages
 * Reusable: Same footer for all test pages
 * Loosely Coupled: Only depends on RouterLink
 */
@Component({
  selector: 'app-test-footer',
  imports: [RouterLink],
  templateUrl: './test-footer.html',
  styleUrl: './test-footer.scss'
})
export class TestFooterComponent {
}
