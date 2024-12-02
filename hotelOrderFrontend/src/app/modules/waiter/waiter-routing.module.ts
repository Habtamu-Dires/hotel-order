import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ServiceRequestComponent } from './components/service-request/service-request.component';
import { MenuComponent } from './components/waiter-menu/page/menu/menu.component';

const routes: Routes = [
  {path: '', component:MainComponent ,
    children:[
      {path: '', redirectTo: 'orders', pathMatch:'full' },
      {path: 'orders', component:OrdersComponent},
      {path: 'request', component:ServiceRequestComponent},
      {path: 'menu', component:MenuComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaiterRoutingModule { }
