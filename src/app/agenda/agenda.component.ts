import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  calendarOptions = {
    initialView: 'dayGridMonth',
    events: [
      { title: 'Event 1', date: '2024-05-01' },
      { title: 'Event 2', date: '2024-05-02' }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
