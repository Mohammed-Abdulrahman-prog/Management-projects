import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks: any[] = [];
  loading = false;
  projectId: number = 0;

  showModal = false;
  isEdit = false;

  form = {
    id: null,
    title: '',
    description: '',
    status: 'pending'
  };

  constructor(
    private taskService: TaskService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTasks();
  }

  // تحميل المهام
  loadTasks() {
    this.loading = true;
    this.taskService.getTasksByProject(this.projectId).subscribe({
      next: (res: any) => {
        this.tasks = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        alert('خطأ في تحميل المهام');
      }
    });
  }

  // فتح إضافة
  openAddTask() {
    this.isEdit = false;
    this.form = {
      id: null,
      title: '',
      description: '',
      status: 'pending'
    };
    this.showModal = true;
  }

  // تعديل
  editTask(task: any) {
    this.isEdit = true;
    this.form = { ...task };
    this.showModal = true;
  }

  // حفظ التعديل او الاضافة
  saveTask() {
    if (!this.form.title) {
      alert('العنوان مطلوب الرجاء ادخل عنوان المهام');
      return;
    }
    if (this.isEdit) {
      this.taskService.updateTask({
        ...this.form,
        project_id: this.projectId}).subscribe(() => {

          const index = this.tasks.findIndex(t => t.id == this.form.id);
          if (index !== -1) {
            this.tasks[index] = { ...this.form };
          }
          this.loadTasks();
          this.closeModal();
        });

    } else {
      this.taskService.addTask({
        ...this.form,
        project_id: this.projectId}).subscribe((res: any) => {
          const newTask = {
            ...this.form,
            id: res.id
          };
          this.loadTasks();
          this.tasks.unshift(newTask);
          this.closeModal();
        });
    }
  }

  // حذف
  deleteTask(id: number) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id != id);
      this.loadTasks();
    });
  }

  // إغلاق
  closeModal() {
    this.showModal = false;
  }
}