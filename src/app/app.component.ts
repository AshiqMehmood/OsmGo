import { ConfigService } from './services/config.service';
import { Component, Input } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { TagsService } from './services/tags.service';
import { StatesService } from './services/states.service';
import { Plugins } from '@capacitor/core';

import { MapService } from './services/map.service';
import { DataService } from './services/data.service';

const { Device, SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
 
  constructor(
    private platform: Platform,
    public configService: ConfigService,
    private translate: TranslateService,
    public tagService: TagsService,
    public statesService: StatesService,
    public mapService: MapService,
    public dataService: DataService,
    public navCtrl: NavController, 

  ) {
    this.initializeApp();

  }

  ngAfterViewInit(): void {
    SplashScreen.hide();
    
  }

  async initializeApp() {
    this.translate.setDefaultLang('en');
    this.configService.platforms = this.platform.platforms();
    this.configService.deviceInfo = await Device.getInfo();

    await this.configService.loadAppVersion();

   

  }



}
