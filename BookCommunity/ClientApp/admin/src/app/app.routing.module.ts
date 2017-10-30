import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DataTableModule } from 'angular2-datatable';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user/list/user.list.component';
import { UserDetailComponent } from './user/detail/user.detail.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        UserListComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        DataTableModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            {
                path: 'users', component: UserListComponent,
                children: [
                    { path: 'add', component: UserDetailComponent },
                    { path: 'edit/:id', component: UserDetailComponent }
                ]
            },
        ])
    ]
})
export class AppRoutingModule {
}
