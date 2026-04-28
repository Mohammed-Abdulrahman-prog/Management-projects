import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';

export const routes: Routes = [
    { path: '', component: ProjectListComponent },
    { path: 'tasks/:id', component: TaskListComponent } 
];
