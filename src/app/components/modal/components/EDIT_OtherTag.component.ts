import { Component, Input, Output, EventEmitter } from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

export interface TagList {
	name: string;
  }

  
@Component({
    selector: 'edit-other-tag',
    styleUrls: ['./style.scss'],
    template: `
		  
				  <mat-chip
				  
				  [selectable]="selectable"
				  [removable]="removable" (removed)="remove(tag)">
					
				 		 {{tag.key}}={{tag.value}}
					
                    <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
                  </mat-chip>
                 
       
  `
})
export class EditOtherTag {
    @Input() tag;
    @Output() deleteTag = new EventEmitter();
	removable = true;
	selectable = true;
	visible =true;
	tagList: TagList[] =[
		
	]
		
	ngOnInit(): void{
		this.add(this.tag);
	}

    eventDeleteTag() {
        this.deleteTag.emit(this.tag);
	}
	
	add(tags): void {
		const key= tags.key
		const value = tags.value
		// Add our fruit
		if ((value || '').trim()) {
		  this.tagList.push({name: value.trim()});
		}
	
	
	  }
	
	  remove(tags: TagList): void {
		const index = this.tagList.indexOf(tags);
	
		if (index >= 0) {
		  this.tagList.splice(index, 1);
		}
	  }
	

}

/**
  <ion-card>
				<ion-card-header>
				<ion-icon name="code"></ion-icon>	<b>{{tag.key}}</b>
				</ion-card-header>
				<ion-card-content>
				    <div class="wrapperEdit2cols">
				        <div class="contentEdit2cols">
								<ion-item>
									<ion-input type="text" [(ngModel)]="tag.value" [placeholder]="tag.key"></ion-input>
								</ion-item>
						</div>

						<div class="buttonEdit2cols">
							<ion-icon (click)="eventDeleteTag()" name="close" style="width: 2em; height: 2em;"></ion-icon>
						</div>
					</div>

				</ion-card-content>
			</ion-card>
 */