import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

 private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) { }

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
   return this.http.get<{[key: string]: PlaceData}>('https://ionic-angular-course-44af6-default-rtdb.firebaseio.com/offered-places.json').pipe(
      map(resData => {
        console.log('res ', resData);
        const places = [];
        for(const key in resData) {
          if(resData.hasOwnProperty(key)) {
            places.push(new Place(
              key, 
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].userId
              ));

          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places);
      })
    )
  }

  getPlace(id: string) {
  return  this.places.pipe(
      take(1),
      map(places => {
        return {...places.find(p => p.id === id)};
      })
    )
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;

 const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://media.gettyimages.com/photos/exclusive-luxury-villa-with-swimming-pool-picture-id1156916949?k=6&m=1156916949&s=612x612&w=0&h=9E6Y37Rj8SRlG5QowgUm5nfc-feYigpiheVdg2E0yYs=',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
  return  this.http.post<{name: string}>('https://ionic-angular-course-44af6-default-rtdb.firebaseio.com/offered-places.json', {...newPlace, id: null}).pipe(
      switchMap(responseData => {
        generatedId = responseData.name;
        return this.places
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
    
  }


  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
       const updatedPlaceIndex = places.findIndex(place => place.id === placeId);
       const updatedPlaces = [...places];
       const oldPlace = updatedPlaces[updatedPlaceIndex];
             updatedPlaces[updatedPlaceIndex] = new Place(
               oldPlace.id,
               title,
               description,
               oldPlace.imageUrl,
               oldPlace.price,
               oldPlace.availableFrom,
               oldPlace.availableTo,
               oldPlace.userId
             );
        this._places.next(updatedPlaces);
      })
    )
  }
}
