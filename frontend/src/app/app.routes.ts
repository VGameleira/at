import { Routes } from '@angular/router';
import { ClientsListComponent } from './components/clients/clients-list';
import { OrdersListComponent } from './components/orders/orders-list';
import { ProductsListComponent } from './components/products/products-list';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'clients', component: ClientsListComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'orders', component: OrdersListComponent },
];
