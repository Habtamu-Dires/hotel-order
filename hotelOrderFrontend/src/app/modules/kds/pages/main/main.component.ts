import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { OrderComponent } from "../../components/order/order.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, OrderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
