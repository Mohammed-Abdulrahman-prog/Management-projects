import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  api = 'http://localhost:8080/projects_manager/projects.php';

  constructor(private http: HttpClient) {}

  getProjects() {
    return this.http.get(this.api);
  }

  addProject(data: any) {
    return this.http.post(this.api, {
      ...data,
      action: 'create'
    });
  }

  updateProject(data: any) {
    return this.http.post(this.api, {
      ...data,
      action: 'update'  
    });
  }

  deleteProject(id: number) {
      return this.http.post(this.api, {
          action: 'delete',
          id: id
      });
  }
}