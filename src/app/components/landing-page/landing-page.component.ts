import { Component, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular'
import { ConfigService } from 'src/app/services/config.service';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  

  constructor(public navCtrl: NavController,
              public configService: ConfigService
    ) { }


  ngOnInit() {}

  pushPage(value){  
    this.navCtrl.navigateForward(value);
   
  }

  
}


