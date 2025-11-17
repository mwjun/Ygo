import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AgeGateComponent } from './components/age-gate/age-gate';
import { CategorySelectionComponent } from './components/category-selection/category-selection';
import { ErrorComponent } from './components/error/error';
import { SubscriptionConfirmedComponent } from './components/subscription-confirmed/subscription-confirmed';
import { UnsubscribedComponent } from './components/unsubscribed/unsubscribed';
import { ageVerificationGuard } from './guards/age-verification-guard';

export const routes: Routes = [
  {
    path: '',
    component: AgeGateComponent,
    pathMatch: 'full'
  },
  {
    path: 'category-selection',
    component: CategorySelectionComponent,
    canActivate: [ageVerificationGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ageVerificationGuard]
  },
  {
    path: 'verify',
    component: SubscriptionConfirmedComponent
  },
  {
    path: 'subscription-confirmed',
    component: SubscriptionConfirmedComponent
  },
  {
    path: 'unsubscribe',
    component: UnsubscribedComponent
  },
  {
    path: 'unsubscribed',
    component: UnsubscribedComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
