import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.max(180)],
      price: [null, Validators.min(1)],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    });
  }


  onCreateOffer() {
 
    if(!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({keyboardClose: true, message: 'Pleas Wait....'})
    .then(loadingEl => {
      loadingEl.present();
      const formValue = this.form.value;
    
      this.placesService.addPlace(
        formValue.title, 
        formValue.description, 
        +formValue.price,
        new Date(formValue.dateFrom),
        new Date(formValue.dateTo),
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/tab/offers']);
        })
      
    })
    
  }

}
