import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { OsmApiService } from '../../services/osmApi.service';
import { ConfigService } from 'src/app/services/config.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginPage {
    username: string;
    password: string;
    errorLogin;
    loading = false;
    isAndroid = this.platform.platforms().includes('hybrid')

    constructor(public osmApi: OsmApiService, 
        public navCtrl: NavController, 
        public configService: ConfigService,
        public platform: Platform, 
        private _snackbar:MatSnackBar )
        {
       
    }

    openSnackBar(message: string, action?: string){
        this._snackbar.open(message, action, {
            duration: 2000,
          })
    }

    login() {
        this.loading = true;
        this.osmApi.getUserDetail$(this.username, this.password, true, this.configService.config.passwordSaved)
        .subscribe(res => {
            this.loading = false;
            this.navCtrl.pop();
        }, (error => {
            console.log(error);
            this.loading = false;
            this.errorLogin = error;
            this.openSnackBar("Login Failed !", "Try Again");
        })
        );
    }


      // TODO: May be bug...
      oauthLogin(){
        this.loading = true;
        if (!this.osmApi.isAuthenticated()){
            this.osmApi.login$()
                .subscribe(e => {
                    this.osmApi.getUserDetail$()
                    .subscribe( user => {
                            this.configService.setUserInfo(user);
                            this.loading = false;
                            this.navCtrl.pop();
                    })
                })
            

        } else {
            this.osmApi.getUserDetail$()
            .subscribe( user=> {
                this.loading = false;
                this.configService.setUserInfo(user);
            })

        }
    }

    passwordSavedChange(e){
        this.configService.setPasswordSaved(e.detail.checked)
    }

}
