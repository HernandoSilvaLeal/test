import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild,  Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
    /**
     * Constructor
     */
    constructor(
        private _authService: LoginService,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._check(redirectUrl);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    private _check(redirectURL: string): Observable<boolean> {
        // Check the authentication status
        return this._authService.checkTokenIsValid()
            .pipe(
                switchMap((authenticated) => {
                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the sign-in page
                        this._router.navigate(['sign-in'], { queryParams: { redirectURL } });
                        // Prevent the access
                        return of(false);
                    }
                    // Allow the access
                    return of(true);
                })
            );
    }
}
