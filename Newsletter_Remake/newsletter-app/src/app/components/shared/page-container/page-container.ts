import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-container.html',
  styleUrl: './page-container.css'
})
export class PageContainerComponent {
  @Input() maxWidth: 'narrow' | 'wide' = 'wide';
  
  get containerClass(): string {
    return this.maxWidth === 'narrow' ? 'container container-narrow' : 'container';
  }
}
