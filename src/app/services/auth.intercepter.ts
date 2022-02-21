import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public auth:AuthService){}
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const login = "/login"
    const reg = "/reg"


    if (req.url.search(login) === -1 && req.url.search(reg) === -1){
      console.log(req.url)
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${this.auth.fetchCredentials().token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError(
        (err, caught) => {
          if (err.status === 401) {
            this.handleAuthError();
            return of(err);
          }
          if (err.status === 403) {
            this.handleForbiddenError();
            return of(err);
          }
          throw err;
        }
      )
    );
  }
  handleForbiddenError() {
   // this.auth.goToPricing();
  }

  public handleAuthError() {
   window.localStorage.clear();
   window.open("/login","_self");
  }
}
