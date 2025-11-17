import { Component, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent {
}
