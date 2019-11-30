import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { query } from 'test-helpers/functions';

import { ConnectionErrorOverlayComponent } from './connection-error-overlay.component';

describe('ConnectionErrorOverlayComponent', () => {
    let component: ConnectionErrorOverlayComponent;
    let fixture: ComponentFixture<ConnectionErrorOverlayComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConnectionErrorOverlayComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConnectionErrorOverlayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render in the DOM', () => {
        expect(query(fixture.debugElement, '.error-icon svg')).toBeTruthy();
        expect(query(fixture.debugElement, '.error-description')).toBeTruthy();
    });
});
