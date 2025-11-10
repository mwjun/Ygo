import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  @Input() contentRatingPath: string = 'assets/img/cr-digital.png';
  @Input() version: string = 'v 3.0.1';
}
