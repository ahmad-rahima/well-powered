import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { firstValueFrom, Observable, of } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  async login(username: string, password: string) {
    const observable$ = this.http.post('api/login/', { username, password }, this.httpOptions)
      .pipe(
        catchError((err, res) => {
          console.error(err);
          console.log(`operation failed: ${err.msg}`);
          return of(res);
        })
      );

    const authResult: any = await firstValueFrom(observable$);
    localStorage.setItem('id_token', authResult['access_token']);

  }

  logout(): void {
  }

  isLoggedIn() {
    return !(localStorage.getItem('id_token') === "undefined" ||
      localStorage.getItem('id_token') === null);
  }

}
