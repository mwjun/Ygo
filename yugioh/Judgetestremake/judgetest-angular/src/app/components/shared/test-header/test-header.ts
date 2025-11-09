import { Component, Input } from '@angular/core';

/**
 * TestHeader Component
 * Single Responsibility: Display test header with logo and time warning
 * Reusable: Can be used by any test page
 * Loosely Coupled: Only depends on input properties
 */
@Component({
  selector: 'app-test-header',
  imports: [],
  templateUrl: './test-header.html',
  styleUrl: './test-header.scss'
})
export class TestHeaderComponent {
  @Input() timeLimit: number = 30;
}
