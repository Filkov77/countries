import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
// import * as jQuery from 'jquery';

@Component({
    selector: '[app-world-map]',
    templateUrl: './world-map.component.html',
})
export class WorldMapComponent implements OnChanges, AfterViewInit {

    @ViewChild('WorldMap', { static: false })
    worldMap!: ElementRef;

    @Input()
    countryCode: string | undefined; // @TODO extract interface

    @Output()
    selectCountryOnMap: EventEmitter<string> = new EventEmitter();

    fillerColor = '#ff0000'; // @TODO pick appropriate color
    fillerNeighborColor = '#00ff00'; // @TODO pick appropriate color

    ngOnChanges(changes: SimpleChanges) {
        if (changes.countryCode && !changes.countryCode.firstChange) {
            if (this.countryCode) {
                console.log('map changes', this.countryCode);
                const mapObject = ($(this.worldMap.nativeElement) as any).vectorMap('get', 'mapObject');
                // console.log(mapObject.getSelectedRegions());
                mapObject.clearSelectedRegions();
                mapObject.setSelectedRegions(this.countryCode);
                // mapObject.series.regions[0].clear();
                // mapObject.series.regions[0].setValues({ [this.countryInfo]: 'filler' });

            }
        }
    }

    ngAfterViewInit() {
        this.setupMap();
    }

    private setupMap() {
        const mapElement = ($(this.worldMap.nativeElement) as any).vectorMap({
            map: 'world_mill_en',
            regionsSelectable: true,
            regionStyle: {
                selected: {
                    fill: this.fillerColor
                }
            },
            selectedRegions: [this.countryCode],

            onRegionSelected: (event: Event, code: string, isSelected: boolean) => {
                console.log(code, this.countryCode, isSelected);
                if (isSelected && code !== this.countryCode) {
                    this.selectCountryOnMap.emit(code);
                    console.log('onRegionSelected', code);
                }
                /*const worldMap = ($(this.worldMap.nativeElement) as any).vectorMap('get', 'mapObject');
                const selectedRegion = worldMap.getSelectedRegions()[0];
                if (selectedRegion !== this.countryCode) {
                    this.selectCountryOnMap.emit(selectedRegion);
                    console.log('onRegionSelected', selectedRegion);
                }*/

            }
            /* series: {
                 regions: [{
                     scale: {
                         filler: this.fillerColor
                     },
                     attribute: 'fill',
                     values: selectedNeighbors
                 }]
             }*/
        });
        // const mapObject = ($(this.worldMap.nativeElement) as any).vectorMap('get', 'mapObject');
        // mapObject.onRegionSelected = () => {
        //     const selectedRegion = ($(this.worldMap.nativeElement) as any).vectorMap('get', 'mapObject').getSelectedRegions()[0];
        //     this.selectCountry.emit(selectedRegion);

        // };
        // mapObject.setSelectedRegions(this.countryCode!);
    }

}
