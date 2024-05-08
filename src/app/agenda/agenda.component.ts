import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Agrega esta línea

import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  public citas=[];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin,interactionPlugin,timeGridPlugin],
    initialView: 'timeGridWeek',
    dateClick: (arg) => this.openModal(arg.dateStr),
    eventClick: (arg) => this.showEventDetails(arg),
    weekends: true,
    locale: esLocale,
    firstDay: 0,
    events: [],
    headerToolbar: {
      start: 'dayGridMonth,timeGridWeek,timeGridDay', // Agregar opciones de vista de mes, semana y día
      center: 'title',
      end: 'today prev,next',
    },  
  };
  eventsPromise: Promise<EventInput[]>;

  // Arreglo de Terapeutas (ejemplo)
public terapeutas = [
  { id: 1, nombre: 'Dr. Juan Pérez' },
  { id: 2, nombre: 'Lic. María Gómez' },
  { id: 3, nombre: 'Psic. Carlos Rodríguez' }
  // Agrega más terapeutas según sea necesario
];

// Arreglo de Pacientes (ejemplo)
public pacientes = [
  { id: 101, nombre: 'Ana Martínez' },
  { id: 102, nombre: 'Pedro Sánchez' },
  { id: 103, nombre: 'Laura Torres' }
  // Agrega más pacientes según sea necesario
];

  constructor(public apiService:ApiService) { }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
  }

  openModal(date: string) {
    // Convertir la fecha a un formato compatible con el campo datetime-local (YYYY-MM-DDTHH:mm)
    const selectedDate = new Date(date);
  
    // Ajustar la fecha a la zona horaria local
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const hours = selectedDate.getHours().toString().padStart(2, '0');
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
  
    // Combina todas las partes para obtener el valor adecuado
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  
    Swal.fire({
      title: 'Crear Cita',
      html: `
        <select id="swal-select1" class="swal2-select" placeholder="Selecciona un paciente">
          ${this.pacientes.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
        </select>
        <select id="swal-select2" class="swal2-select" placeholder="Selecciona un terapeuta">
          ${this.terapeutas.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('')}
        </select>
        <input id="swal-input3" class="swal2-input" type="datetime-local" value="${formattedDateTime}" placeholder="Fecha y Hora">
        <input id="swal-input4" class="swal2-input" placeholder="Motivo de la cita">
        <input id="swal-input5" class="swal2-input" placeholder="Estado de la cita">
        <input id="swal-input6" class="swal2-input" placeholder="Duración en minutos">
        <textarea id="swal-input7" class="swal2-textarea" placeholder="Notas"></textarea>`,
      focusConfirm: false,
      preConfirm: () => {
        const pacienteID = parseInt((<HTMLSelectElement>document.getElementById('swal-select1')).value);
        const terapeutaID = parseInt((<HTMLSelectElement>document.getElementById('swal-select2')).value);
        const fechaHoraInput = (<HTMLInputElement>document.getElementById('swal-input3')).value;
  
        // Formatear correctamente la fecha y hora
        const fechaHora = new Date(fechaHoraInput).toISOString();
  
        const motivo = (<HTMLInputElement>document.getElementById('swal-input4')).value;
        const estado = (<HTMLInputElement>document.getElementById('swal-input5')).value;
        const duracionMinutos = parseInt((<HTMLInputElement>document.getElementById('swal-input6')).value);
        const notas = (<HTMLTextAreaElement>document.getElementById('swal-input7')).value;
  
        this.apiService.ejecutar('Guarda_Cita', [pacienteID, fechaHora, terapeutaID, motivo, estado, duracionMinutos, notas])
          .subscribe(response => {
            console.log('Cita guardada exitosamente:', response);
            this.calendarOptions.events = [];
            this.ObtenerCitas();
            Swal.fire('Éxito', 'La cita se ha guardado correctamente', 'success');
          }, error => {
            console.error('Error al guardar la cita:', error);
            Swal.fire('Error', 'No se pudo guardar la cita. Inténtalo de nuevo más tarde.', 'error');
          });
      }
    });
  }
  
  




  //  let _response;
  //_response = response;
  //localStorage.setItem('id', _response.id);

  ObtenerCitas(){
        // Obtener las citas desde la base de datos
        this.apiService.ejecutar('Obtener_Citas', []).subscribe(response => {
          let _response;
          _response = response;
          // Mapear las citas a eventos para el calendario
          const eventos = _response.success.recordset.map(cita => ({
            id: cita.CitaID,
            title: cita.Motivo,
            start: cita.FechaHora,
            // Otros campos de la cita si es necesario
          }));
    
          // Actualizar los eventos en el calendario
          this.calendarOptions.events = eventos;
        });
  }


  showEventDetails(arg) {
    const evento = arg.event;
    const title = evento.title || "Sin título";
    const start = evento.start ? new Date(evento.start).toISOString().slice(0, 16) : "";
    const eventId = evento.id; 

    Swal.fire({
      title: `Detalles de la Cita: ${title}`,
      html: `
        <p><b>Fecha y Hora:</b> ${start}</p>
        <p><b>Motivo:</b> ${title}</p>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#d33',
      preConfirm: () => {
        this.apiService.ejecutar('Elimina_Cita', [eventId])
          .subscribe(response => {
            console.log('Cita eliminada exitosamente:', response);
            this.calendarOptions.events = [];
            this.ObtenerCitas();
            Swal.fire('Éxito', 'La cita se ha eliminado correctamente', 'success');
          }, error => {
            console.error('Error al eliminar la cita:', error);
            Swal.fire('Error', 'No se pudo eliminar la cita. Inténtalo de nuevo más tarde.', 'error');
          });
      }
    });
  }



  ngOnInit(): void {
    this.ObtenerCitas();
  }

}
