import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ItemsComponent } from './pages/items/items.component';
import { DashbordComponent } from './pages/dashbord/dashbord.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ManageCategoryComponent } from './pages/manage-category/manage-category.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { UsersComponent } from './pages/users/users.component';
import { ManageItemsComponent } from './pages/manage-items/manage-items.component';
import { ManageLocationComponent } from './pages/manage-location/manage-location.component';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';

const routes: Routes = [
  { 
    path: '', 
    component: MainComponent,
    children:[
      {path: '', redirectTo:'dashboard', pathMatch:'full'},
      {path: 'dashboard',component:DashbordComponent},
      {path: 'categories', component:CategoriesComponent},
      {path: 'categories/manage', component:ManageCategoryComponent},
      {path: 'categories/manage/:categoryId', component:ManageCategoryComponent},
      {path: 'items', component:ItemsComponent},
      {path: 'items/manage', component:ManageItemsComponent},
      {path: 'items/manage/:itemId', component:ManageItemsComponent},
      {path: 'locations', component:LocationsComponent},
      {path: 'locations/manage', component:ManageLocationComponent},
      {path: 'locations/manage/:locationId', component:ManageLocationComponent},
      {path: 'users', component:UsersComponent},
      {path: 'users/manage', component:ManageUserComponent},
      {path: 'users/manage/:userId', component:ManageUserComponent}
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
