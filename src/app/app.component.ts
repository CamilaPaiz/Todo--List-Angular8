import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface Task {
  id: number;
  name: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'To-do List';
  tasks: Task[] = [];
  newTask:'';
  editingTask: Task | null = null;
  isSubmitting = false;
  
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get<Task[]>('http://127.0.0.1:8000/todo/').subscribe(data => {
      this.tasks = data;
    });
  }

  addTask() {
    this.isSubmitting = true;
    this.http.post<Task>('http://127.0.0.1:8000/todo/', { name: this.newTask }).subscribe(task => {
      this.tasks.push({ ...task, done: false });
      this.newTask = '';
      this.isSubmitting = false;
    });
  }
  
  removeTask(id: number) {
    this.http.delete(`http://127.0.0.1:8000/todo/${id}/`).subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }

  editTask(id: number) {
    this.editingTask = this.tasks.find(task => task.id === id);
  }
  
  updateTask() {
    if (this.editingTask) {
      this.http.put<Task>(`http://127.0.0.1:8000/todo/${this.editingTask.id}/`, this.editingTask).subscribe(task => {
        const index = this.tasks.findIndex(task => task.id === this.editingTask.id);

        if (index >= 0) {
          this.tasks[index] = task;
        }
        this.editingTask = null;
      });
    }
  }
  
  
  cancelEdit() {
    this.editingTask = null;
  }
  
  markDone(id: number, done: boolean) {
    this.http.patch<Task>(`http://127.0.0.1:8000/todo/${id}/`, { done }).subscribe(() => {
      this.tasks = this.tasks.map(task => {
        if (task.id === id) {
          return { ...task, done };
        }
        return task;
      });
    });
  }
  
}
