import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Place;
  private placeSub: Subscription;

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('editId')) {
        this.navCtrl.navigateBack('/places/tab/offers');
        return;
      }

    this.placeSub = this.placesService.getPlace(paramMap.get('editId')).subscribe(place => {
        this.place = place;
      });
    }) 
    this.form = this.fb.group({
      title: [this.place.title, Validators.required],
      description: [this.place.description, Validators.max(180)],
    });
  }

  onEditOffer() {
    if(!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
        ).subscribe(() => {
          this.loadingCtrl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tab/offers']);
        })
    })
   
  }

  ngOnDestroy() {
    if(this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
