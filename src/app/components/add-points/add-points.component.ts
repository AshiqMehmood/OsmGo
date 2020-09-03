import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { MatTabHeaderPosition } from '@angular/material/tabs';


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

    background: ThemePalette = 'primary';
    color: ThemePalette = 'warn';
    header: MatTabHeaderPosition = 'below';

  constructor(
  
    ) {
        //this.oldTagConfig = this.params.data.tagConfig
     }

   

    
  ngOnInit() {
   
   
  }










 
    
}
