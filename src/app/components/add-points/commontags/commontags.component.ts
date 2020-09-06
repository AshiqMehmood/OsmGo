import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface State {
    flag: string;
    name: string;
    population: string;
  }

@Component({
  selector: 'app-commontags',
  templateUrl: './commontags.component.html',
  styleUrls: ['./commontags.component.scss'],
})  
export class CommontagsComponent implements OnInit {
    name= '';
    number= '';
    value = '';
    website='';

    
    options: string[]  = ['Mon - Fri', 'Mon - Sat', 'Mon - Thu', 'Sat - Thu'];
    myControl = new FormControl();
    stateCtrl = new FormControl();
    filteredStates: Observable<State[]>;
    filteredHours: Observable<string[]>;
  
    states: State[] = [
      {
        name: 'Aeroway',
        population: '2.978M',
        // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
        flag: 'flight'
      },
      {
        name: 'Amenity',
        population: '39.14M',
        // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
        flag: 'pin_drop'
      },
      {
        name: 'Railway',
        population: '20.27M',
        // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
        flag: 'train'
      },
      {
        name: 'Building',
        population: '27.47M',
        // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
        flag: 'business'
      },
      {
        name: 'Emergency',
        population: '27.47M',
        // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
        flag: 'local_hospital'
      },
      {
        name: 'Highway',
        population: '27.47M',
        // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
        flag: ' directions'
      },
      {
        name: 'Restaurent',
        population: '27.47M',   
        // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
        flag: 'restaurant'
      },
      {
        name: 'Bus Station',
        population: '27.47M',   
        // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
        flag: 'departure_board'
      }
    ];

  constructor(private _snackBar: MatSnackBar) {
    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this._filterStates(state) : this.states.slice())
    );

    this.filteredHours = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterhours(value))
      );
   } 
   
   
   openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

   private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterhours(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


  ngOnInit() {}

}


