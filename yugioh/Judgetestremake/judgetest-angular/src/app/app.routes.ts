import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AgeGateComponent } from './pages/age-gate/age-gate';
import { DemoJudgeComponent } from './pages/demo-judge/demo-judge';
import { RulingsComponent } from './pages/rulings/rulings';
import { PolicyComponent } from './pages/policy/policy';
import { ageVerificationGuard } from './guards/age-verification-guard';

/**
 * Application Routes
 * Implements route guards for security (age verification)
 * Loosely Coupled: Guards are independent, can be reused
 */
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'age-gate', component: AgeGateComponent },
  
  // Protected routes - require age verification
  { 
    path: 'demo-judge', 
    component: DemoJudgeComponent,
    canActivate: [ageVerificationGuard]
  },
  { 
    path: 'rulings', 
    component: RulingsComponent,
    canActivate: [ageVerificationGuard]
  },
  { 
    path: 'policy', 
    component: PolicyComponent,
    canActivate: [ageVerificationGuard]
  }
];
