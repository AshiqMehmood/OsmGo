import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import { MenuController } from '@ionic/angular'
import {COMMA, ENTER} from '@angular/cdk/keycodes';

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
    input: string = ""
   
 
    searchText = '';
 

    add(text, text2){
        this.chip = text + '=' + text2
    }

    delete(text){
        this.input = ""
        text = this.input
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