import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/projects_manager/tasks.php';

  constructor(private http: HttpClient) {}

  // جلب المهام حسب المشروع
  getTasksByProject(projectId: number) {
    return this.http.get(`${this.apiUrl}?project_id=${projectId}`);
  }

  addTask(data: any) {
    return this.http.post(this.apiUrl, {
      ...data,
      action: 'create'
    });
  }

  updateTask(data: any) {
    return this.http.post(this.apiUrl, {
      ...data,
      action: 'update'
    });
  }

  deleteTask(id: number) {
    return this.http.post(this.apiUrl, {
      action: 'delete',
      id: id
    });
  }
}