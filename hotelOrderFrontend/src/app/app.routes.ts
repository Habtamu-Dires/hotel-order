import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './services/guard/auth.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'login/:url', component:LoginComponent},
    {path: 'admin', 
        loadChildren: () => import('./modules/admin/admin.module')
            .then(m => m.AdminModule),
            canActivate: [authGuard]
    },
    {path: 'customer',
        loadChildren: () => import('./modules/customer/customer.module')
        .then(m => m.CustomerModule)
    },
    {path: 'waiter',
        loadChildren:() => import('./modules/waiter/waiter.module')
        .then(m => m.WaiterModule),
        canActivate:[authGuard]
    }


];
