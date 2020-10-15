import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';

import {
  NavController, 
  ModalController,
} from '@ionic/angular';
@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
})
export class WelcomeModalComponent implements OnInit {

  constructor(
public modalCtrl: ModalController,
public configService: ConfigService,
public navCtrl: NavController
  ) { }

  ngOnInit() {}
  
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  pushPage(value){  
    this.navCtrl.navigateForward(value);
    this.dismiss();
  }

}

