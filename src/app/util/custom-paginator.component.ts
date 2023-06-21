import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginator implements MatPaginatorIntl {
  changes = new Subject<void>();
  itemsPerPageLabel: string = 'Elementos por página';
  nextPageLabel: string = 'Siguiente';
  previousPageLabel: string = 'Anterior';
  firstPageLabel: string = 'Primera página';
  lastPageLabel: string = 'Última página';
  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `Página 1 de 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  }
}
