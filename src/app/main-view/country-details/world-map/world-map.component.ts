import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
    selector: '[app-world-map]',
    templateUrl: './world-map.component.html',
})
export class WorldMapComponent implements OnChanges, AfterViewInit {

    @ViewChild('WorldMap', { static: false })
    worldMap!: ElementRef;

    @Input()
    countryCode: string | undefined;

    @Output()
    selectCountryOnMap: EventEmitter<string> = new EventEmitter();

    fillerColor = '#FF920A';

    ngOnChanges(changes: SimpleChanges) {
        if (changes.countryCode && !changes.countryCode.firstChange) {
            if (this.countryCode) {
                const mapObject = ($(this.worldMap.nativeElement) as any).vectorMap('get', 'mapObject');
                mapObject.clearSelectedRegions();
                mapObject.setSelectedRegions(this.countryCode);
            }
        }
    }

    ngAfterViewInit() {
        this.setupMap();
    }

    private setupMap() {
        ($(this.worldMap.nativeElement) as any).vectorMap({
            map: 'world_mill_en',
            regionsSelectable: true,
            regionStyle: {
                selected: {
                    fill: this.fillerColor
                }
            },
            selectedRegions: [this.countryCode],

            onRegionSelected: (event: Event, code: string, isSelected: boolean) => {
                if (isSelected && code !== this.countryCode) {
                    this.selectCountryOnMap.emit(code);
                }
            }
        });
    }

}
