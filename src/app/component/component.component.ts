import { Component } from '@angular/core';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css'],
})
export class ComponentComponent {
  navIndexValue: number = 5;
  navTitleChange(index: number) {
    this.navIndexValue = index;
  }
}
