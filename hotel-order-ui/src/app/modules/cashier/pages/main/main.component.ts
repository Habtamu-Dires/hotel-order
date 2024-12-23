import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { OrdersComponent } from "../../components/orders/orders.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, OrdersComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
