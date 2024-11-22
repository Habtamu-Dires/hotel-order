import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-bar-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar-item.component.html',
  styleUrl: './side-bar-item.component.scss'
})
export class SideBarItemComponent {

  @Input() component:string | undefined;
  @Input() isActiveComponent: boolean | undefined;
}
