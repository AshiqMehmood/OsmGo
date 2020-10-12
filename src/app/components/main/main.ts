import { Component, NgZone, AfterViewInit } from '@angular/core';
import {
  NavController, MenuController,
  ModalController, ToastController, Platform, AlertController, LoadingController
} from '@ionic/angular';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

import { OsmApiService } from '../../services/osmApi.service';
import { TagsService } from '../../services/tags.service';
import { MapService } from '../../services/map.service';
import { DataService } from '../../services/data.service';
import { LocationService } from '../../services/location.service';
import { AlertService } from '../../services/alert.service';
import { ConfigService } from '../../services/config.service';
import { ModalsContentPage } from '../modal/modal';

import { timer, forkJoin } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SwUpdate } from '@angular/service-worker';
import { StatesService } from 'src/app/services/states.service';

import { Plugins, ToastShowOptions } from '@capacitor/core';
import { DialogMultiFeaturesComponent } from '../dialog-multi-features/dialog-multi-features.component';
import { switchMap } from 'rxjs/operators';
import { InitService } from 'src/app/services/init.service';

//for bottomsheet
import { cloneDeep, clone } from 'lodash';
import { addAttributesToFeature } from '../../../../scripts/osmToOsmgo/index.js'


const { App } = Plugins;

@Component({
  templateUrl: './main.html',
  selector: 'main',
  styleUrls: ['./main.scss']
})

export class MainPage implements AfterViewInit {
  modalIsOpen = false;
  menuIsOpen = false;
  newVersion = false;
  loadingData = false
  loading = true;
  dataAlert = "";

  // authType = this.platform.platforms().includes('hybrid') ? 'basic' : 'oauth'

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public menuCtrl: MenuController,
    public osmApi: OsmApiService,
    public tagsService: TagsService,
    public mapService: MapService,
    public dataService: DataService,
    public locationService: LocationService,
    public alertService: AlertService,
    public configService: ConfigService,

    private alertCtrl: AlertController,
    private _ngZone: NgZone,
    private router: Router,
    private translate: TranslateService,
    public loadingController: LoadingController,
    private swUpdate: SwUpdate,
    public statesService: StatesService,
    public initService: InitService,
    private _bottomSheet: MatBottomSheet

  ) {



    this.router.events.subscribe((e) => {

      if (e instanceof NavigationEnd) {
        if (e['urlAfterRedirects'] === '/main') {
          this.configService.freezeMapRenderer = false;
          // la carte ne detect pas toujours le changement de taille du DOM...
          if (this.mapService.map) {
            timer(300).subscribe(t => {
              this.mapService.map.resize();
            });
          }

        } else {
          this.configService.freezeMapRenderer = true;
        }
      }
    });

    mapService.eventShowDialogMultiFeatures.subscribe(async (features) => {
    const modal = await this.modalCtrl.create({
      component: DialogMultiFeaturesComponent,
      cssClass: 'dialog-multi-features',
      componentProps: { features: features, jsonSprites: this.tagsService.jsonSprites }
    });
    await modal.present();

    modal.onDidDismiss().then(d => {
      if (d && d.data){
        const feature = d.data
       this.mapService.selectFeature(feature); // bof
      }
      // console.log(d)
    })

    });

   


    mapService.eventShowModal.subscribe(async (_data) => {
      this.configService.freezeMapRenderer = true;
      const newPosition = (_data.newPosition) ? _data.newPosition : false;


      const modal = await this.modalCtrl.create({
        component: ModalsContentPage,
        componentProps: { type: _data.type, data: _data.geojson, newPosition: newPosition, origineData: _data.origineData }
      });
      await modal.present();
      this.modalIsOpen = true;

      modal.onDidDismiss()
      .then(d => {
        this.modalIsOpen = false;
        const data = d.data;
        this.configService.freezeMapRenderer = false;
        if (data) {
          if (data['type'] === 'Move') {
            this.mapService.eventMoveElement.emit(data);
          }
          if (data['redraw']) {
            timer(50).subscribe(t => {
              this.mapService.eventMarkerReDraw.emit(this.dataService.getGeojson());
              this.mapService.eventMarkerChangedReDraw.emit(this.dataService.getGeojsonChanged());
            });
          }
        }
      });

    });
 

    this.alertService.eventNewAlert.subscribe(alert => {
      this.presentToast(alert);
    });


  }

  ngOnInit(): void {
    // sync user and isAuth

    this.swUpdate.available.subscribe(event => {
      this.newVersion = true;
    });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }

  openMenu() {
    this.configService.freezeMapRenderer = true;
    this.menuIsOpen = true;
    // history.pushState({menu:'open'}, 'menu')
  }

  closeMenu() {
    this.configService.freezeMapRenderer = false;
    this.menuIsOpen = false;
  }

  onMapResized(e) {
    if (this.mapService.map) {
      this.mapService.map.resize();
    }

  }



  presentConfirm() {
    this.alertCtrl.create({
      header: this.translate.instant('MAIN.EXIT_CONFIRM_HEADER'),
      message: this.translate.instant('MAIN.EXIT_CONFIRM_MESSAGE'),
      buttons: [
        {
          text: this.translate.instant('SHARED.NO'),
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: this.translate.instant('SHARED.YES'),
          handler: () => {
            window.navigator['app'].exitApp();
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });

  }



  //testing function-------------------------------------------------------------------------

  pushPage(path) { //  (click) = mapService.openModalOsm
    this.navCtrl.navigateForward(path)
}
//------------------------------------------------------------------------------



  loadData() {
    // L'utilisateur charge les données, on supprime donc le tooltip
    this._ngZone.run(() => {
      this.alertService.displayToolTipRefreshData = false;
      this.loadingData = true;
    });


    const bbox: any = this.mapService.getBbox();
    this.osmApi.getDataFromBbox(bbox)
      .subscribe(newDataJson => { // data = geojson a partir du serveur osm
        this.dataService.setGeojsonBbox(newDataJson['geojsonBbox']);
        this.mapService.eventNewBboxPolygon.emit(newDataJson['geojsonBbox']);
        this.dataService.setGeojson(newDataJson['geojson']);
        this.mapService.eventMarkerReDraw.emit(newDataJson['geojson']);
        this._ngZone.run(() => {
          this.loadingData = false;
        });
      },
        err => {
          this.loadingData = false;
          console.log(err);
          this.presentToast(err.message);
        });
  }


  async presentToast(message) {


      const toast = await this.toastCtrl.create({
        message: message,
        duration: 4000,
        position: 'top',
        buttons: [
          {
            text: 'X',
            role: 'cancel',
            handler: () => {
           
            }
          }
        ]
      });
      toast.present();
    

    // this.toastCtrl.create({
    //   message: message,
    //   position: 'top',
    //   duration: 4000,
    //   showCloseButton: true,
    //   closeButtonText: 'X'
    // })
    //   .then(toast => {
    //     toast.present();
    //   });

  }

  ngAfterViewInit() {

    this.initService.initLoadData$()
      .subscribe( ([config, userInfo, changeset, savedFields, presets, tags, baseMaps, bookmarksIds, lastTagsIds, geojson, geojsonChanged, geojsonBbox]) => {
        this.locationService.enableGeolocation();
        this.osmApi.initAuth();

        this.mapService.initMap(config)
    })

    //alert snackbar
    this.mapService.eventMapIsLoaded.subscribe( e => {
        this.loading = false;
        timer(2000).subscribe( e => {
          const nbData = this.dataService.getGeojson().features.length;
          if (nbData > 0) {
            // Il y a des données stockées en mémoires... 
            this.alertService.eventNewAlert.emit(nbData+ ' ' + this.translate.instant('MAIN.START_SNACK_ITEMS_IN_MEMORY'));
          } else {
            // L'utilisateur n'a pas de données stockées, on le guide pour en télécharger... Tooltip
            this.alertService.eventDisplayToolTipRefreshData.emit();
          }
        })
    })



    this.alertService.eventDisplayToolTipRefreshData.subscribe(async e => {


      const toast = await this.toastCtrl.create({
        message: this.translate.instant('MAIN.LOAD_BBOX'),
        duration: 4000,
        position: 'bottom',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              if (this.mapService.map && this.mapService.map.getZoom() > 16) {
                this.loadData();
              }
            }
          }
        ]
      });
      toast.present();


      // const toast = await this.toastCtrl.create({
      //   position: 'bottom',
      //   message: this.translate.instant('MAIN.LOAD_BBOX'),
      //   showCloseButton: true,
      //   duration: 6000,
      //   closeButtonText: 'Ok'
      // });
      // toast.present();
      // toast.onDidDismiss().then(ev => {
      //   if (ev.role === 'cancel') {
      //     if (this.mapService.map && this.mapService.map.getZoom() > 16) {
      //       this.loadData();
      //     }
      //   }
      // });
    });



    window.addEventListener('load', (e) => {
      window.history.pushState({ noBackExitsApp: true }, '')
    })

    window.addEventListener('popstate', (e) => {
      if (this.menuIsOpen) {
        window.history.pushState({ noBackExitsApp: true }, '')
        this.closeMenu();
      } else if (this.modalIsOpen) {
        window.history.pushState({ noBackExitsApp: true }, '')
        this.modalCtrl.dismiss();
      } else {
        window.history.pushState({ noBackExitsApp: true }, '')
      }
    })

  }

  exitApp() {
    App.exitApp()
  }
}


@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: './bottom-sheet-overview-example-sheet.html',
})
export class BottomSheetOverviewExampleSheet {
  summary = { 'Total': 0, 'Create': 0, 'Update': 0, 'Delete': 0 };
    changesetId = '';
    commentChangeset = '';
    isPushing = false;
    featuresChanges = [];
    basicPassword = null;
    connectionError;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewExampleSheet>,
    public dataService: DataService,
    public osmApi: OsmApiService,
    public tagsService: TagsService,
    public mapService: MapService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public configService: ConfigService,
    public platform: Platform,
    private translate: TranslateService,
    public initService: InitService
    ) {

        this.commentChangeset = this.configService.getChangeSetComment();
        this.featuresChanges = this.dataService.getGeojsonChanged().features; 
  }
  ngOnInit(): void {

    if (!this.initService.isLoaded){
        console.log('ooo')
      this.initService.initLoadData$()
      .subscribe( e => {
          this.basicPassword = this.configService.user_info.password; 
          this.commentChangeset = this.configService.getChangeSetComment();
          this.featuresChanges = this.dataService.getGeojsonChanged().features; 
        })
    }

this.basicPassword = this.configService.user_info.password;      
}


  openLink(event: MouseEvent): void {
    this.navCtrl.navigateForward('/login')
    this._bottomSheetRef.dismiss();
    event.preventDefault();
   
  }

  presentConfirm(event: MouseEvent) {
    this.alertCtrl.create({
        header: this.translate.instant('SEND_DATA.DELETE_CONFIRM_HEADER'),
        message: this.translate.instant('SEND_DATA.DELETE_CONFIRM_MESSAGE'),
        buttons: [
            {
                text: this.translate.instant('SHARED.CANCEL'),
                role: 'cancel',
                handler: () => {

                }
            },
            {
                text: this.translate.instant('SHARED.CONFIRM'),
                handler: () => {
                    this.cancelAllFeatures();
                }
            }
        ]
    }).then(alert => {
        alert.present();
    });

    this._bottomSheetRef.dismiss();
    event.preventDefault();
}

displayError(error) {
    this.alertCtrl.create({
        message: error,
        buttons: [
            {
                text: this.translate.instant('SHARED.CLOSE'),
                role: 'cancel',
                handler: () => {

                }
            }
        ]
    })
        .then(alert => {
            alert.present();
        });
}

getSummary() {
    const summary = { 'Total': 0, 'Create': 0, 'Update': 0, 'Delete': 0 };
    this.featuresChanges = this.dataService.getGeojsonChanged().features;
    const featuresChanged = this.dataService.getGeojsonChanged().features;

    for (let i = 0; i < featuresChanged.length; i++) {
        const featureChanged = featuresChanged[i];
        summary[featureChanged.properties.changeType]++;
        summary['Total']++;
    }
    return summary;
}

/**
 * Send this feature to OSM
 */
private pushFeatureToOsm(featureChanged, CS, password) {
    return new Promise((resolve, reject) => {
        if (featureChanged.properties.changeType === 'Create') {
            this.osmApi.apiOsmCreateNode(featureChanged, CS, password)
                .subscribe(id => {
                    let newFeature = {};
                    newFeature['type'] = 'Feature';
                    newFeature['id'] = 'node/' + id;
                    newFeature['properties'] = {};
                    newFeature['geometry'] = cloneDeep(featureChanged.geometry);
                    newFeature['properties']['type'] = 'node';
                    newFeature['properties']['id'] = id;
                    newFeature['properties']['tags'] = cloneDeep(featureChanged.properties.tags);
                    newFeature['properties']['meta'] = {};
                    newFeature['properties']['meta']['version'] = 1;
                    newFeature['properties']['meta']['user'] = this.configService.getUserInfo().display_name;
                    newFeature['properties']['meta']['uid'] = this.configService.getUserInfo().uid;
                    newFeature['properties']['meta']['timestamp'] = new Date().toISOString();
                    newFeature['properties']['time'] = new Date().getTime();

                    newFeature = this.mapService.getIconStyle(newFeature); // style
                    addAttributesToFeature(newFeature)
                    this.summary.Total--;
                    this.summary.Create--;
                    
                    this.dataService.deleteFeatureFromGeojsonChanged(featureChanged);

                    this.dataService.addFeatureToGeojson(newFeature); // creation du nouveau TODO
                    this.featuresChanges = this.dataService.getGeojsonChanged().features;
                    resolve(newFeature)
                },
                    async error => {
                        featureChanged['error'] = error.error || error.response || 'oups';
                        this.dataService.updateFeatureToGeojsonChanged(featureChanged);
                        this.featuresChanges = this.dataService.getGeojsonChanged().features;
                        reject(error);

                    });
        } else if
            (featureChanged.properties.changeType === 'Update') {

            this.osmApi.apiOsmUpdateOsmElement(featureChanged, CS, password)
                .subscribe(newVersion => {
                    let newFeature = {};
                    newFeature = featureChanged;
                    newFeature['properties']['meta']['version'] = newVersion;
                    newFeature['properties']['meta']['user'] = this.configService.getUserInfo().display_name;
                    newFeature['properties']['meta']['uid'] = this.configService.getUserInfo().uid;
                    newFeature['properties']['meta']['timestamp'] = new Date().toISOString();
                    newFeature['properties']['time'] = new Date().getTime();
                    if (newFeature['properties']['tags']['fixme']) {
                        newFeature['properties']['fixme'] = true;
                    } else {
                        if (newFeature['properties']['fixme'])
                            delete newFeature['properties']['fixme'];
                    }

                    if (newFeature['properties']['deprecated']){
                        delete newFeature['properties']['deprecated']
                    }
                    delete newFeature['properties']['changeType'];
                    delete newFeature['properties']['originalData'];


                    newFeature = this.mapService.getIconStyle(newFeature); // style
                    addAttributesToFeature(newFeature)
                    this.summary.Total--;
                    this.summary.Update--;

                    this.dataService.deleteFeatureFromGeojsonChanged(featureChanged);
                    this.dataService.addFeatureToGeojson(newFeature);

                    this.featuresChanges = this.dataService.getGeojsonChanged().features;
                    resolve(newFeature)

                },
                    error => {
                     
                        featureChanged['error'] = error.error || error.response || 'oups';
                        this.dataService.updateFeatureToGeojsonChanged(featureChanged);
                  
                        this.featuresChanges = this.dataService.getGeojsonChanged().features;
                        
                        reject(error)
                        // this.pushFeatureToOsm(this.dataService.getGeojsonChanged().features[this.index], this.changesetId, this.index);

                    });
        } else if
            (featureChanged.properties.changeType === 'Delete') {
            if (featureChanged.properties.usedByWays){
                let emptyFeaturetags = clone(featureChanged);
                emptyFeaturetags['properties']['tags']= {};

                this.osmApi.apiOsmUpdateOsmElement(emptyFeaturetags, CS, password)
                .subscribe(newVersion => {
                    this.summary.Total--;
                    this.summary.Delete--;
                    this.dataService.deleteFeatureFromGeojsonChanged(featureChanged);
                    this.featuresChanges = this.dataService.getGeojsonChanged().features;
                    resolve(newVersion);
                })
               

            }else {
                this.osmApi.apiOsmDeleteOsmElement(featureChanged, CS, password)
                .subscribe(id => {
                    this.summary.Total--;
                    this.summary.Delete--;
                    this.dataService.deleteFeatureFromGeojsonChanged(featureChanged);
                    this.featuresChanges = this.dataService.getGeojsonChanged().features;
                    resolve(id);
                },
                    async error => {
                        featureChanged['error'] = error.error || error.response || 'oups';
                        this.dataService.updateFeatureToGeojsonChanged(featureChanged);
                        this.featuresChanges = this.dataService.getGeojsonChanged().features;
                        reject(error)
                    });
            }
        
        }
    })
}

async presentAlertPassword(user_info) {
    const alert = await this.alertCtrl.create({
      header: user_info.display_name,
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: this.translate.instant('SEND_DATA.PASSWORD_OSM')
        }
        ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ok',
          handler: (e) => {
            console.log(e.password);
            this.basicPassword = e.password;
            this.pushDataToOsm(this.commentChangeset, this.basicPassword );
          }
        }
      ]
    });

    await alert.present();
  }


 userIsConnected(password){
    return new Promise((resolve, reject) => {
        this.osmApi.getUserDetail$(this.configService.user_info.user, password, this.configService.user_info.authType === 'basic' ? true : false, null, true)
        .subscribe( u => {
            resolve( true)
        },
        err => {
            reject(err.error)
            if (this.configService.user_info.authType === 'basic' && !this.configService.user_info.password){
                this.basicPassword = null;
                this.isPushing = false;
            }
            // console.log('HTTP Error', err.error)
        }
        )
    })

 } 


async pushDataToOsm(commentChangeset, password) {
    if (this.isPushing) {
        console.log('Already being sent')
        return;
    }
    this.configService.setChangeSetComment(commentChangeset);
    

     if (this.configService.user_info.authType == 'basic' && !this.basicPassword){
   
        await this.presentAlertPassword(this.configService.user_info)
        return

    }
    this.isPushing = true;
    let userIsConnected;
    try {
        userIsConnected = await this.userIsConnected(password);
    } catch (error) {
        this.connectionError = error;
           if (this.configService.user_info.authType === 'basic' && !this.configService.user_info.password){
                this.basicPassword = null;
                this.isPushing = false;
            }
        this.isPushing = false;
        return;
    }
    this.connectionError = undefined;

 
    this.osmApi.getValidChangset(commentChangeset, password)
        .pipe()
        .subscribe(async CS => {
            const cloneGeojsonChanged = this.dataService.getGeojsonChanged()
            this.changesetId = CS;
            for (let feature of cloneGeojsonChanged.features) {
                try {
                    await this.pushFeatureToOsm(feature, this.changesetId, password)
                } catch (error) {
                    console.log(error)
                }
            };
            this.isPushing = false;
            this.summary = this.getSummary();
            this.mapService.eventMarkerReDraw.emit(this.dataService.getGeojson());
            this.mapService.eventMarkerChangedReDraw.emit(this.dataService.getGeojsonChanged());
            this.featuresChanges = this.dataService.getGeojsonChanged().features;
            if (this.dataService.getGeojsonChanged().features.length === 0) { // Y'a plus d'éléments à pusher
                this.navCtrl.pop();
            }
        });
}

async cancelAllFeatures() { // rollBack
    const featuresChanged = this.dataService.getGeojsonChanged().features;
    for (let feature of featuresChanged) {
        this.dataService.cancelFeatureChange(feature);
    }
    await this.dataService.resetGeojsonChanged();
    this.summary = this.getSummary();
    this.featuresChanges = this.dataService.getGeojsonChanged().features;
    timer(100).subscribe(t => {
        this.mapService.eventMarkerReDraw.emit(this.dataService.getGeojson());
        this.mapService.eventMarkerChangedReDraw.emit(this.dataService.getGeojsonChanged());
        this.navCtrl.pop();
    });
}

centerToElement(pointCoordinates) {
    if (this.mapService.map.getZoom() < 18.5) {
        this.mapService.map.setZoom(18.5);
    }
    this.mapService.map.setCenter(pointCoordinates);
    this.navCtrl.pop();
}

ngAfterViewInit() {
    this.summary = this.getSummary();
}

}