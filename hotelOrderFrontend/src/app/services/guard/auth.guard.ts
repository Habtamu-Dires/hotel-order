import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if(tokenService.isTokenNotValid()){
    const url = route.url[0].path;
    router.navigate(['login', url]);
    return false;
  }
  return true;
};
