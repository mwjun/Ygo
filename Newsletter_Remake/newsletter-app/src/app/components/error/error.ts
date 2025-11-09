import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.html',
  styleUrl: './error.css',
  encapsulation: ViewEncapsulation.None
})
export class ErrorComponent {
}
