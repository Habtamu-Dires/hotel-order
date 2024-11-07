import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { HomeComponent } from './home/home.component';
import { WaiterComponent } from './waiter/waiter/waiter.component';

export const routes: Routes = [
    {path: 'home',component:HomeComponent},
    {path: 'menu', component: MenuComponent},
    {path: '', component:HomeComponent},
    {path: 'item-detail', component:ItemDetailComponent},

    {path: 'waiter', component:WaiterComponent},

    {path: '**', redirectTo: '/home'},

];
