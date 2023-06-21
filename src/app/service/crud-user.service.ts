import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { UserDataModel } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class CrudUserService {
  private url = 'http://localhost:8080/rest';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http
      .get(`${this.url}/users`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body;
          return body;
        })
      );
  }

  registerUser(bean: UserDataModel) {
    return this.http
      .post(`${this.url}/users`, bean, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body;
          return body;
        })
      );
  }

  getRoles() {
    return this.http
      .get(`${this.url}/role`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body;
          return body;
        })
      );
  }

  getUbigeo() {
    return this.http
      .get(`${this.url}/ubigeo`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body;
          return body;
        })
      );
  }

  deleteUser(idUsuario: number) {
    return this.http
      .delete(`${this.url}/users/${idUsuario}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          const body = response.body;
          return body;
        })
      );
  }
}
