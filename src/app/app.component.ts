/// <reference types="@types/googlemaps" />
import {AfterViewInit, Component, ViewChild} from '@angular/core';
// import {} from '@types/google.maps';
declare let google: any;

export interface Location {
  formattedAddress?: string;
  placeId?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'biker-app';
  autocompleteInput: string = '';
  @ViewChild('addresstext') addresstext: any;

  locationList: Location[] = [];
  currentPlace;
  matrixResponse;
  origins: string[] = [];
  destinations: string[] = [];

  data = [
    {
      "elements": [
        {
          "distance": {
            "text": "27,7 km",
            "value": 27695
          },
          "duration": {
            "text": "1 hora 42 minutos",
            "value": 6146
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "68,4 km",
            "value": 68407
          },
          "duration": {
            "text": "3 horas 45 minutos",
            "value": 13523
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "91,4 km",
            "value": 91352
          },
          "duration": {
            "text": "4 horas 56 minutos",
            "value": 17758
          },
          "status": "OK"
        }
      ]
    },
    {
      "elements": [
        {
          "distance": {
            "text": "1 m",
            "value": 0
          },
          "duration": {
            "text": "1 min",
            "value": 0
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "40,7 km",
            "value": 40697
          },
          "duration": {
            "text": "2 horas 3 minutos",
            "value": 7408
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "63,6 km",
            "value": 63642
          },
          "duration": {
            "text": "3 horas 14 minutos",
            "value": 11643
          },
          "status": "OK"
        }
      ]
    },
    {
      "elements": [
        {
          "distance": {
            "text": "43,1 km",
            "value": 43138
          },
          "duration": {
            "text": "2 horas 14 minutos",
            "value": 8030
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "1 m",
            "value": 0
          },
          "duration": {
            "text": "1 min",
            "value": 0
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "23,2 km",
            "value": 23234
          },
          "duration": {
            "text": "1 hora 15 minutos",
            "value": 4475
          },
          "status": "OK"
        }
      ]
    }
  ];

  ngAfterViewInit(): void {
    // const input = document.getElementById("pac-input") as HTMLInputElement;
    //
    // const options = {
    //   fields: ["formatted_address", "geometry", "name"],
    //   strictBounds: false,
    //   types: ["establishment"],
    // };

    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
      {
        componentRestrictions: { country: [ 'US', 'UK', 'BR' ] },
        types: [ '(cities)' ],
         fields: [ 'formatted_address', 'place_id', 'geometry' ] // address_components, adr_address, formatted_address, geometry, html_attributions, icon, icon_background_color, icon_mask_base_uri, name, photos, place_id, reference, types, url, utc_offset, utc_offset_minutes, vicinity, website
      });

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      // const place = autocomplete.getPlace();

      // get lat and lng: autocomplete.getPlace().geometry.location.lat() / autocomplete.getPlace().geometry.location.lgn()
      console.log('place: ', autocomplete.getPlace());

      this.currentPlace = autocomplete.getPlace();
    });
  }

  add() {
    let newLocation: Location = {};

    newLocation.formattedAddress = this.currentPlace.formatted_address;
    newLocation.placeId = this.currentPlace.place_id;

    this.locationList.push(newLocation);

    this.addresstext.nativeElement.value = '';
  }

  createJourney() {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
      origins: [ 'Nova Trento, Brasil', 'Brusque, Brasil', 'Blumenau, Brasil' ],
      destinations: [ 'Brusque, Brasil', 'Blumenau, Brasil', 'Indaial, Brasil' ],
      travelMode: google.maps.TravelMode.BICYCLING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    }).then( (response: google.maps.DistanceMatrixResponse) => {
      this.matrixResponse = response; //JSON.stringify(response, null, 2);
      console.log('RESPONSE createJourney(): ', response.rows);

      this.extractDistancesFromApiResponse();
    } );
  }

  extractDistancesFromApiResponse() {
    let result: string[] = [];
    let rowAux = 0;
    let elementAux = 0;

    this.matrixResponse.rows.forEach( (row, rowIndex) => {
      console.log(`element ${rowIndex}`);

      row.elements.forEach( (element, elementIndex) => {
        if (rowAux === rowIndex) {
          if (elementAux === elementIndex) {
            result.push(element.distance.text);

            rowAux++;
            elementAux++;
          }
        }
      });
    });

    console.log('extractDistancesFromApiResponse(): ', result);
  }

  createOriginAndDestinationLists() {
    this.locationList.push({ formattedAddress: 'Nova Trento, Brasil' });
    this.locationList.push({ formattedAddress: 'Brusque, Brasil' });
    this.locationList.push({ formattedAddress: 'Blumenau, Brasil' });
    this.locationList.push({ formattedAddress: 'Indaial, Brasil' });

    console.log('locationList: ', this.locationList);
    // let origins: string[] = [];
    // let destinations: string[] = [];

    // origins: [ 'Nova Trento, Brasil', 'Brusque, Brasil', 'Blumenau, Brasil' ],
    // destinations: [ 'Brusque, Brasil', 'Blumenau, Brasil', 'Indaial, Brasil' ],

    this.locationList.forEach( (location, index) => {
        this.origins.push(location.formattedAddress || 'empty');
        this.destinations.push(location.formattedAddress || 'empty');
    });

    this.origins.pop();
    this.destinations.shift();

    console.log('origins: ', this.origins);
    console.log('destinations: ', this.destinations);

    this.createJourney();
  }
}
