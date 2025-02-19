import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routeConfig: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login page'
  },
  {
    path: 'articles',
    component: HomeComponent,
    title: 'Home page'
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    title: 'Home details'
  }
];

export default routeConfig;
