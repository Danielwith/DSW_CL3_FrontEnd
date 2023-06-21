import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  form: FormGroup;
  navItems: string[] = [
    'Ventas',
    'Productos',
    'Gastos',
    'Notas electrónicas',
    'Guías de remisión',
    'Resumen',
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apaterno: ['', Validators.required],
      amaterno: ['', Validators.required],
      correo: ['', Validators.required],
      dni: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      ubigeo: ['', Validators.required],
    });
  }
}
