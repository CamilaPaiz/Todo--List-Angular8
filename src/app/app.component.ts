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

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get<Task[]>('http://127.0.0.1:8000/todo/').subscribe(data => {
      this.tasks = data;
    });
  }

  addTask() {
    this.http.post<Task>('http://127.0.0.1:8000/todo/', { name: this.newTask }).subscribe(task => {
      this.tasks.push({ ...task, done: false });
      this.newTask='';
    });
  }
  
  removeTask(id: number) {
    this.http.delete(`http://127.0.0.1:8000/todo/${id}/`).subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
    });
  }

}
