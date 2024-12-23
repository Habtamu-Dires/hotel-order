import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../token/token.service';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  //list of endpoints that require tokens
  const tokenRequiredEndpoints = [
    {url: '/users', methods:['All']},
    {url: '/auth/register', methods:['All']},
    {url: '/categories', methods:['DELETE', 'POST', 'PUT']},
    {url: '/items', methods:['DELETE', 'POST', 'PUT']},
    {url: '/locations', methods:['DELETE', 'POST', 'PUT']},
    {url: '/orders', methods:['GET','DELETE', 'PUT']},
    {url: '/order-details', methods:['All']},
    {url: '/service-requests', methods:['GET', 'PUT']}
  ];
  for(const endpoint of tokenRequiredEndpoints){
    const matchesUrl = req.url.includes(endpoint.url);
    const matchesMethod = endpoint.methods.includes('All') || endpoint.methods.includes(req.method)
    if(matchesUrl && matchesMethod) {
      const token = inject(TokenService).token;
      if(token){
        const authReq = req.clone({
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`
          })
        });
        return next(authReq);
      }
    }
  }    
  return next(req);
};
