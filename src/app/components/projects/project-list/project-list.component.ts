    import { Component, OnInit } from '@angular/core';
    import { ProjectService } from '../../../services/project.service';
    import { CommonModule } from '@angular/common';
    import { ChangeDetectorRef } from '@angular/core';
    import { FormsModule } from '@angular/forms';    
    import { Router } from '@angular/router';

    @Component({
    selector: 'app-project-list',
    standalone: true, 
    imports: [CommonModule, FormsModule,], 
    templateUrl: './project-list.component.html',
    styleUrls: ['project-list.component.css']
    })
    export class ProjectListComponent implements OnInit {

        projects: any[] = [];
        selectedProject: any = null;
        loading = true;
        showModal = false;
        isEdit = false;

        constructor(
            private projectService: ProjectService,
            private cdr: ChangeDetectorRef,
            private router: Router
        ) {}

        ngOnInit(): void {
            this.loadProjects();
        }

        goToTasks(project: any) {
            this.router.navigate(['/tasks', project.id]);
        }

        form = {
            id: null,
            name: '',
            description: ''
        };

        openAddForm() {
            this.isEdit = false;
            this.form = { id: null, name: '', description: '' };
            this.showModal = true;
        }

        updateProject(project: any) {
            this.isEdit = true;
            this.form = { ...project };
            this.showModal = true;
        }


        loadProjects() {
            this.loading = true;
            this.projectService.getProjects().subscribe({
            next: (res: any) => {
                this.projects = res;
                console.log('DATA:', res);
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                alert('خطأ في تحميل المشاريع');
            }
            });
        }

        
        selectProject(project: any) {
            this.selectedProject = project;
        }

        saveProject() {
            if (!this.form.name) {
                alert('الاسم مطلوب الرجاء ادخل اسم المشروع');
                return;
            }
            if (this.isEdit) {
                this.projectService.updateProject(this.form).subscribe(() => {
                    const index = this.projects.findIndex(p => p.id == this.form.id);
                    if (index !== -1) {
                        this.projects[index] = { ...this.form };
                    }
                    this.loadProjects();
                    this.closeModal();
                });
            } else {
                this.projectService.addProject(this.form).subscribe((res: any) => {
                    const newProject = {
                        ...this.form,
                        id: res.id , 
                    };
                    this.projects.unshift(newProject);
                    this.closeModal();
                });
            }
        }

        closeModal() {
            this.showModal = false;
            this.loadProjects();
        }

        deleteProject(id: number) {
            if (!confirm('هل أنت متأكد من الحذف؟')) return;
            this.projectService.deleteProject(id).subscribe({
                next: (res: any) => {
                    if (res.message === 'cannot_delete') {
                        alert('لا يمكن حذف المشروع لأنه يحتوي على مهام');
                        return;
                    }
                this.projects = this.projects.filter(p => p.id != id);
                this.loadProjects();
                },
                error: () => {
                alert('فشل الحذف');
                }
            });
        }

        trackById(index: number, item: any) {
            return item.id;
        }
    }