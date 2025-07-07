import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CorkboardComponent } from './corkboard/corkboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CorkboardComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected title = 'Corkboard';
}
