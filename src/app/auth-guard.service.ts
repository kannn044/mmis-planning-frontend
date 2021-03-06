import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Injectable()
export class AuthGuard {

  public token: string;
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router) { }

  canActivate() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const accessRight = decodedToken.accessRight;

      if (accessRight) {
        if (this.jwtHelper.isTokenExpired(token)) {
          this.router.navigate(['login']);
          return false;
        } else {
          const rights = accessRight.split(',');
          let isAdmin = false;
          if (_.indexOf(rights, 'BM_ADMIN') > -1) {
            isAdmin = true;
          } else {
            isAdmin = false;
          }

          if (!isAdmin) {
            this.router.navigate(['login']);
            return false;
          } else {
            return true;
          }
        }

      } else {
        this.router.navigate(['login']);
        return false;
      }

    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
