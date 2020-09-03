import { Component, OnInit } from '@angular/core';
import {  NavParams } from '@ionic/angular';
import { TagsService } from '../../services/tags.service';
import { ConfigService } from '../../services/config.service';
import { TagConfig } from '../../../type'
import { MenuController } from '@ionic/angular'

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
  }

  
@Component({
  selector: 'app-add-points',
  templateUrl: './add-points.component.html',
  styleUrls: ['./add-points.component.scss'],
})
export class AddPointsComponent implements OnInit {

    name: string = ""
    value: string= ""
    chip: string = ""
    load:boolean = false

    selectedKey: string;
    tagsOfselectedKey;
    loading = true;
    allTags: TagConfig[];
    searchText = '';
    currentListOfTags: TagConfig[] = [];
    typeFiche = 'list';
    customValue = '';
    oldTagConfig: TagConfig;
    geometriesPossible: string[] = []
    geometryType: 'point' | 'vertex' | 'line' | 'area'
    displayType = 'lastTags'

    add(text, text2){
        this.chip = text + '=' + text2
    }


  constructor(private menu: MenuController
       
    ) {
        //this.oldTagConfig = this.params.data.tagConfig
     }

    openFirst(){
        this.menu.enable(true, 'first')
        this.menu.open('first')
        
    }
    selectItem(){
        this.load = !this.load
    }

    
  ngOnInit() {
   
   
  }










 
    
}
/*
 <mat-drawer-container>  
                             <mat-drawer #drawer mode="push">
                                <button mat-icon-button color="accent" aria-label="Example icon button with a menu icon"
                                    (click)="drawer.toggle()"
                                    isRoundButton="true"
                                >
                                   Done
                                  </button>
                                 
                                  <mat-card>Simple card</mat-card>
                                  <mat-card>Simple card</mat-card>
                                  <mat-card>Simple card</mat-card>

                             </mat-drawer>
*/