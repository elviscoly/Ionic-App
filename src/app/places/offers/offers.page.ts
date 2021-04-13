import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedPlaces: Place[]
  private placeSub: Subscription
  constructor(
    private placesService: PlacesService, 
    private router: Router,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
  this.placeSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
    });
   
  }

  ionViewWillEnter() {
    this.loadingCtrl.create({
      message: 'Loading...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.fetchPlaces().subscribe(() => {
        loadingEl.dismiss();
      });
    })
   
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tab', 'offers', 'edit', id]);
    console.log('id ', id);
  }

  ngOnDestroy() {
    if(this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
