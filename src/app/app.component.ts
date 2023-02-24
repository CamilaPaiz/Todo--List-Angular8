import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';


interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'todo-list';
  tasks: Task[] = [];
}
