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
  newTask = '';
  editingTaskId: number | null = null;
 editingTaskCopy: Task = { id: 0, name: '', done: false };
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
    const task = this.tasks.find(t => t.id === id);
    this.editingTaskCopy = { ...task };
    this.editingTaskId = id;
  }
  
  
  updateTask(task: Task) {
    this.http.put<Task>(`http://127.0.0.1:8000/todo/${task.id}/`, task).subscribe(() => {
      const index = this.tasks.findIndex(t => t.id === task.id);
      if (index >= 0) {
        this.tasks[index] = task;
      }
      this.editingTaskId = null;
    });
  }
  
  cancelEdit() {
    const taskIndex = this.tasks.findIndex(t => t.id === this.editingTaskId);
    if (taskIndex >= 0) {
      const originalTask = { ...this.tasks[taskIndex] };
      this.tasks[taskIndex] = originalTask;
    }
    this.editingTaskId = null;
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

