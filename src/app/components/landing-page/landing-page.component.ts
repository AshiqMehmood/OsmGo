import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  

  constructor(public navCtrl: NavController) { }


  ngOnInit() {}

  pushPage(page){
    this.navCtrl.navigateForward(page);
  }
}


