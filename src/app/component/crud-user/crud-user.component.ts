import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppModule } from 'src/app/app.module';
import { DateDirective } from 'src/app/directive/date.directive';
import {
  RoleDataModel,
  UbigeoDataModel,
  UserDataModel,
} from 'src/app/model/user.model';
import { CrudUserService } from 'src/app/service/crud-user.service';

@Component({
  selector: 'app-crud-user',
  templateUrl: './crud-user.component.html',
  styleUrls: ['./crud-user.component.css'],
})
export class CrudUserComponent {
  displayedColumns: string[] = [
    'idUsuario',
    'nombres',
    'apaterno',
    'amaterno',
    'correo',
    'dni',
    'fechaNacimiento',
    'fechaRegistro',
    'ubigeo',
    'actions',
  ];
  dataSource: MatTableDataSource<UserDataModel>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userList: UserDataModel[] = [];
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private crudUserService: CrudUserService
  ) {
    this.dataSource = new MatTableDataSource<UserDataModel>([]);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    // Filtrar los datos por nombre, debido a la interfaz CatalogueDataModel
    this.dataSource.filterPredicate = function (data, filter) {
      return data.nombres?.indexOf(filter) != -1;
    };
    // Obtén los datos de tu API o cualquier otra fuente de datos
    this.getUsers();
  }

  // Implementa los métodos para registrar, actualizar y eliminar gastos
  registrarElemento() {
    const dialogRef: MatDialogRef<UpdateDialogContent> = this.dialog.open(
      UpdateDialogContent,
      {
        enterAnimationDuration: 300,
        exitAnimationDuration: 300,
        data: { userInfo: {}, type: 'CREATE' },
      }
    );

    // Recibimos la llamada "emit"
    dialogRef.componentInstance.updateElement.subscribe(() => {
      this.snackBar.open(`Usuario registrado.`, 'OK', {
        duration: 3000,
      });
      this.getUsers();
    });
  }

  actualizarElemento(userInfo: UserDataModel) {
    // Mandamos los datos recibido de la fila
    const dialogRef: MatDialogRef<UpdateDialogContent> = this.dialog.open(
      UpdateDialogContent,
      {
        enterAnimationDuration: 300,
        exitAnimationDuration: 300,
        data: { userInfo, type: 'UPDATE' },
      }
    );

    // Recibimos la llamada "emit"
    dialogRef.componentInstance.updateElement.subscribe(() => {
      this.snackBar.open(`Usuario actualizado.`, 'OK', {
        duration: 4000,
      });
      this.getUsers();
    });
  }

  eliminarElemento(userID: number) {
    // Mandamos los datos recibido de la fila
    const dialogRef: MatDialogRef<DeleteDialogContent> = this.dialog.open(
      DeleteDialogContent,
      {
        enterAnimationDuration: 300,
        exitAnimationDuration: 300,
        data: { userID, type: 'DELETE' },
      }
    );

    // Recibimos la llamada "emit"
    dialogRef.componentInstance.deleteElement.subscribe(() => {
      this.snackBar.open(`Usuario eliminado.`, 'OK', {
        duration: 4000,
      });
      this.getUsers();
    });
  }

  aplicarFiltro(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toUpperCase();
  }

  getUsers() {
    this.crudUserService.getUsers().subscribe({
      next: (response: UserDataModel[]) => {
        this.userList = response;
        console.log(response);

        // Ordenar la lista por el campo idUsuario
        this.userList.sort((a, b) => {
          const idUsuarioA = parseInt(a.idUsuario);
          const idUsuarioB = parseInt(b.idUsuario);
          return idUsuarioA - idUsuarioB;
        });

        this.dataSource.data = this.userList.map((user) => ({
          ...user,
          nombres: user.nombres ? user.nombres.toUpperCase() : 'ERROR',
        }));
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  obtenerDatosOrdenadosYFiltrados() {
    // Aplicar el filtro a los datos
    const filteredData = this.dataSource._filterData(this.userList);

    // Ordenar los datos filtrados
    const sortedData = this.dataSource._orderData(filteredData);

    // Retornar los datos ordenados y filtrados
    console.log(sortedData);
  }
}

@Component({
  selector: 'update-dialog-content',
  template: `
    <div class="dialog">
      <div class="dialog-title">
        <h2>
          {{
            dialogType === 'UPDATE'
              ? 'Actualizar'
              : dialogType === 'CREATE'
              ? 'Registrar'
              : ''
          }}
          Usuario
        </h2>
      </div>
      <div class="dialog-content">
        <form [formGroup]="form" class="dialog-form">
          <div class="row-form full-row">
            <mat-form-field floatLabel="always">
              <mat-label>Rol</mat-label>
              <mat-select
                formControlName="role"
                placeholder="Seleccione un Rol"
                #selectedType
              >
                <mat-option
                  *ngFor="let item of roleList"
                  [value]="item.idRol"
                  >{{ item.nombre }}</mat-option
                >
              </mat-select>
            </mat-form-field>
          </div>
          <div class="row-form full-row">
            <mat-form-field>
              <mat-label>Nombres</mat-label>
              <input
                matInput
                formControlName="nombres"
                [value]="data.nombres"
                (keypress)="filtroAlfabetoKey($event)"
              />
              <mat-error *ngIf="form.get('nombres')?.hasError('required')"
                >Debe ingresar el Nombre del Usuario</mat-error
              >
              <mat-error *ngIf="form.get('nombres')?.hasError('maxlength')"
                >No puede ser mayor de 30 caracteres</mat-error
              >
            </mat-form-field>
          </div>
          <div class="row-form">
            <mat-form-field>
              <mat-label>Ap. Paterno</mat-label>
              <input
                matInput
                formControlName="apaterno"
                [value]="data.apaterno"
                (keypress)="filtroAlfabetoKey($event)"
              />
              <mat-error *ngIf="form.get('apaterno')?.hasError('required')"
                >Debe ingresar el Ap. Paterno</mat-error
              >
              <mat-error *ngIf="form.get('apaterno')?.hasError('maxlength')"
                >No puede ser mayor de 30 caracteres</mat-error
              >
            </mat-form-field>
            <mat-form-field>
              <mat-label>Ap. Materno</mat-label>
              <input
                matInput
                formControlName="amaterno"
                [value]="data.amaterno"
                (keypress)="filtroAlfabetoKey($event)"
              />
              <mat-error *ngIf="form.get('amaterno')?.hasError('required')"
                >Debe ingresar el Ap. Materno</mat-error
              >
              <mat-error *ngIf="form.get('amaterno')?.hasError('maxlength')"
                >No puede ser mayor de 30 caracteres</mat-error
              >
            </mat-form-field>
          </div>
          <div class="row-form">
            <mat-form-field>
              <mat-label>Correo</mat-label>
              <input matInput formControlName="correo" [value]="data.correo" />
              <mat-error *ngIf="form.get('correo')?.hasError('required')"
                >Debe ingresar el Correo</mat-error
              >
              <mat-error *ngIf="form.get('correo')?.hasError('maxlength')"
                >No puede ser mayor de 30 caracteres</mat-error
              >
            </mat-form-field>
            <mat-form-field>
              <mat-label>DNI</mat-label>
              <input
                matInput
                formControlName="dni"
                type="number"
                [value]="data.dni"
              />
              <mat-error *ngIf="form.get('dni')?.hasError('required')"
                >Debe ingresar el DNI</mat-error
              >
              <mat-error *ngIf="form.get('dni')?.hasError('pattern')"
                >DNI invalido</mat-error
              >
            </mat-form-field>
          </div>
          <div class="row-form">
            <mat-form-field>
              <mat-label>Fecha</mat-label>
              <input
                matInput
                formControlName="fechaNacimiento"
                [matDatepicker]="picker"
                readonly
                validateDate
              />
              <mat-datepicker-toggle
                matIconSuffix
                [for]="picker"
              ></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error
                *ngIf="form.get('fechaNacimiento')?.hasError('required')"
                >Debe seleccionar una fecha</mat-error
              >
            </mat-form-field>
            <mat-form-field floatLabel="always">
              <mat-label>Ubigeo</mat-label>
              <mat-select
                formControlName="ubigeo"
                placeholder="Seleccione un Tipo"
              >
                <mat-option
                  *ngFor="let item of ubigeoList"
                  [value]="item.idUbigeo"
                  >{{ item.distrito }}</mat-option
                >
              </mat-select>
            </mat-form-field>
          </div>
        </form>
      </div>
    </div>
    <div class="dialog-button">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        (click)="save()"
        [disabled]="form.invalid"
      >
        Grabar
      </button>
    </div>
  `,
  styles: [
    `
      .dialog-title {
        padding: 15px 20px;
        border: medium solid black;
        border-top: 0;
        border-left: 0;
        border-right: 0;
      }
      .dialog-title > h2 {
        margin: 0;
      }

      .dialog-content {
        height: 70vh;
        overflow-y: scroll;
      }

      .dialog-form {
        display: flex;
        flex-flow: column wrap;
        gap: 10px;
        padding: 20px 0 20px 10px;
      }

      .row-form > mat-form-field {
        margin-right: 10px;
      }

      mat-form-field > textarea {
        overflow: hidden;
      }

      .full-row > mat-form-field {
        width: calc(100% - 10px);
      }

      .dialog-button {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        padding: 20px;
        gap: 8px;
      }

      .description-counter {
        color: black;
        font-size: 12px;
        margin-top: 4px;
      }

      .description-counter.max-length-exceeded {
        color: red;
      }

      .mat-mdc-radio-button ~ .mat-mdc-radio-button {
        margin-left: 16px;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class UpdateDialogContent {
  @Output() updateElement: EventEmitter<void> = new EventEmitter<void>();
  private userData: UserDataModel;
  dialogType: string;
  form: FormGroup;
  ubigeoList: UbigeoDataModel[] = [];
  roleList: RoleDataModel[] = [];
  parseDate: Date | undefined;

  // Agregar contador de letras de la Descripcion
  descriptionLength = 0;

  constructor(
    public dialogRef: MatDialogRef<UpdateDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private crudUserService: CrudUserService,
    private dateValidatorDirective: DateDirective
  ) {
    // Obtener los datos del Producto desde el @Inject
    console.log(data.userInfo);
    this.userData = data.userInfo;

    // Segun el tipo de form que mandamos desde el @Inject
    this.dialogType = data.type;

    // Parsea el Date al actualizar, el date debe llegar como string desde Spring
    if (this.dialogType == 'UPDATE') {
      const dateParts = this.userData.fechaNacimiento.split('-');
      const year = Number(dateParts[0]);
      const month = Number(dateParts[1]);
      const day = Number(dateParts[2]);

      this.parseDate = new Date(year, month - 1, day);
    }

    // Form General para ambos tipos
    this.form = this.fb.group({
      idUsuario: [this.userData.idUsuario],
      nombres: [
        this.userData.nombres,
        [Validators.required, Validators.maxLength(30)],
      ],
      apaterno: [
        this.userData.apaterno,
        [Validators.required, Validators.maxLength(30)],
      ],
      amaterno: [
        this.userData.amaterno,
        [Validators.required, Validators.maxLength(150)],
      ],
      correo: [
        this.userData.correo,
        [Validators.required, Validators.maxLength(150)],
      ],
      dni: [
        this.userData.dni,
        [Validators.required, Validators.pattern(/^\d{8}$/)],
      ],
      fechaNacimiento: [
        this.parseDate,
        [
          Validators.required,
          this.dateValidatorDirective.validate.bind(
            this.dateValidatorDirective
          ),
        ],
      ],
      role: [this.userData.role, [Validators.required]],
      ubigeo: [Number(this.userData.ubigeo), [Validators.required]],
    });

    this.getUbigeo();
    this.getRole();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const data: UserDataModel = {
      idUsuario: this.userData.idUsuario ?? null,
      nombres: this.form.get('nombres')?.value.toUpperCase() ?? '',
      apaterno: this.form.get('apaterno')?.value,
      amaterno: this.form.get('amaterno')?.value,
      correo: this.form.get('correo')?.value,
      dni: this.form.get('dni')?.value,
      fechaNacimiento: this.form.get('fechaNacimiento')?.value,
      ubigeo: this.form.get('ubigeo')?.value,
      role: this.form.get('role')?.value,
    };

    console.log(data);

    this.crudUserService.registerUser(data).subscribe({
      next: (response) => {
        console.log(response);
        // Emite la accion de actualización
        this.updateElement.emit(this.form.value);
      },
      error: (error) => {
        console.error(error);
      },
    });

    this.dialogRef.close();
  }

  getUbigeo() {
    this.crudUserService.getUbigeo().subscribe({
      next: (response: UbigeoDataModel[]) => {
        this.ubigeoList = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getRole() {
    this.crudUserService.getRoles().subscribe({
      next: (response: RoleDataModel[]) => {
        this.roleList = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  filtroAlfabetoKey(event: any): void {
    const charCode = event.which ? event.which : event.keyCode;
    const charValue = String.fromCharCode(charCode);
    const inputValue = event.target.value;

    if (
      charValue === ' ' &&
      (inputValue.trim() === '' || inputValue.endsWith(' '))
    ) {
      // Evitar ingreso de espacio al principio o después de otro espacio
      event.preventDefault();
    } else if (!/^[a-zA-Z\u00C0-\u017F\s0-9]+$/.test(charValue)) {
      // Evitar ingreso de caracteres no alfabéticos ni espacios
      event.preventDefault();
    }
  }

  filtroNumericoKey(event: any): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      // caracteres numéricos (0-9)
      event.preventDefault();
    }
  }
}

@Component({
  selector: 'delete-dialog-content',
  template: `<h2 mat-dialog-title>Confirmación</h2>
    <mat-dialog-content
      >¿Estás seguro de que deseas eliminar este dato?</mat-dialog-content
    >
    <mat-dialog-actions>
      <button mat-button (click)="cerrarDialogo()">No</button>
      <button mat-button color="warn" (click)="eliminar()">Sí</button>
    </mat-dialog-actions>`,
  styles: [``],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  standalone: true,
})
export class DeleteDialogContent {
  @Output() deleteElement: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogContent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private crudUserService: CrudUserService
  ) {}

  cerrarDialogo() {
    this.dialogRef.close();
  }

  eliminar() {
    this.crudUserService.deleteUser(this.data.userID).subscribe({
      next: (response) => {
        console.log(response);
        this.deleteElement.emit();
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.dialogRef.close();
  }
}
