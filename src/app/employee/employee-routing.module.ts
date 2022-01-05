import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import the components so they can be referenced in routes
import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeesComponent } from './list-employees.component';

const routes: Routes = [
    //children route removed for lazy loading purposes
    {
        path: 'employees', children: [
            // list is basically root route
            { path: '', component: ListEmployeesComponent },
            { path: 'create', component: CreateEmployeeComponent },
            { path: 'edit/:id', component: CreateEmployeeComponent },
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
