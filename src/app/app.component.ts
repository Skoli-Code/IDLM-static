import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [
        './app.component.css',
        './app.typography.css',
        '../assets/blaze/generics.global.min.css',
        '../assets/blaze/objects.grid.min.css',
        '../assets/blaze/components.typography.min.css'
    ]
})
export class AppComponent {
  title = 'app works!';
}
