import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  public citas=[];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin,interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: (arg) => this.openModal(arg.dateStr),
    eventClick: (arg) => this.handleDateClick(arg),
    weekends: true,
    events: []
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
    Swal.fire({
      title: 'Crear Cita',
      html:
        `<select id="swal-select1" class="swal2-select" placeholder="Selecciona un paciente">
           ${this.pacientes.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
         </select>` +
        `<select id="swal-select2" class="swal2-select" placeholder="Selecciona un terapeuta">
           ${this.terapeutas.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('')}
         </select>` +
        '<input id="swal-input3" class="swal2-input" type="datetime-local" placeholder="Fecha y Hora">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Motivo de la cita">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Estado de la cita">' +
        '<input id="swal-input6" class="swal2-input" placeholder="Duración en minutos">' +
        '<textarea id="swal-input7" class="swal2-textarea" placeholder="Notas"></textarea>',
      focusConfirm: false,
      preConfirm: () => {
        const pacienteID = parseInt((<HTMLSelectElement>document.getElementById('swal-select1')).value);
        const terapeutaID = parseInt((<HTMLSelectElement>document.getElementById('swal-select2')).value);
        const fechaHoraInput = (<HTMLInputElement>document.getElementById('swal-input3')).value;
    
        // Formatear la fecha y hora en el formato correcto (YYYY-MM-DDTHH:mm:ss)
        const fechaHora = new Date(fechaHoraInput).toISOString();
    
        const motivo = (<HTMLInputElement>document.getElementById('swal-input4')).value;
        const estado = (<HTMLInputElement>document.getElementById('swal-input5')).value;
        const duracionMinutos = parseInt((<HTMLInputElement>document.getElementById('swal-input6')).value);
        const notas = (<HTMLTextAreaElement>document.getElementById('swal-input7')).value;
    
        // Llamar al servicio para guardar la cita en la base de datos
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
            title: cita.Motivo,
            start: cita.FechaHora,
            // Otros campos de la cita si es necesario
          }));
    
          // Actualizar los eventos en el calendario
          this.calendarOptions.events = eventos;
        });
  }


  ngOnInit(): void {
    this.ObtenerCitas();
  }

}
