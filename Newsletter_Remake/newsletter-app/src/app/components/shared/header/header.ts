import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  readonly konamiLogoPath = 'assets/img/konami_logo.png';
  readonly konamiUrl = 'http://www.konami.com/';
}
