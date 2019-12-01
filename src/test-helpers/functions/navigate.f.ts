import { NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationExtras, Router } from '@angular/router';

/**
 * This is safe way to navigate routes when performing unit-test as Router would otherwise trigger error when navigating outside Ng Zone:
 * @link <https://github.com/angular/angular/issues/25837>
 */
export function navigate<T = any>(fixture: ComponentFixture<T>, commands: any[], extras?: NavigationExtras | undefined) {
    const router: Router = TestBed.get(Router);

    return (fixture.ngZone! as NgZone).run(() => {
        return router.navigate(commands, extras);
    });
}
