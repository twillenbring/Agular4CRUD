import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import the components so they can be referenced in routes
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // redirect to the home route if the client side route path is empty
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // new route for lazy loading Employee Module
  //{ path: 'employees', loadChildren: './employee/employee.module#EmployeeModule'},
  // wild card route
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
