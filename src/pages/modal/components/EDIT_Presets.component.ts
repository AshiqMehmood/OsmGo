import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'edit-presets',
    template: `
                    <ion-card *ngIf="tag.preset?.type === 'select'">
                        <ion-card-header>
                        	<b *ngIf="!displayCode">{{tag.preset?.lbl}}</b>
                            <b *ngIf="displayCode">
                            <i class="fa fa-code" ></i>
                            {{tag.preset?.key}}</b>
                        </ion-card-header>

                        <ion-card-content>
                        <ion-grid>
							<ion-row>

                                <ion-col width-90>
                                
                                    <ion-select *ngIf="!displayCode" [interface]="'popover'" [(ngModel)]="tag.value"
                                        style="width: 100%; min-width: 100%;padding-left:0;"
                                    >
                                        <ion-option  *ngFor ="let item of tag.preset.tags;" [value]="item.v" >  {{item.lbl}} </ion-option>
                                    </ion-select>
                                

                                <ion-item *ngIf="displayCode">
										<ion-input type="text" [(ngModel)]="tag.value" [placeholder]="tag.key"></ion-input>
									</ion-item>
                                </ion-col>

								<ion-col width-10 class="ion-col10">
								<i (click)="tag.value = ''" class="fa fa-times fa-2x"></i>
								</ion-col>
							</ion-row>
						</ion-grid>

                        </ion-card-content>
                    </ion-card>



                   <ion-card *ngIf="tag.preset?.type === 'list'">
                        <ion-card-header  (click)="emitOpenModal(tag)">
                        	<b *ngIf="!displayCode">{{ tag.preset?.lbl }} <i  class="fa fa-cog"></i></b>
						    <b *ngIf="displayCode"> <i class="fa fa-code" ></i> {{ tag.preset?.key }}</b>
                        </ion-card-header>

                        <ion-card-content>
                        <ion-grid>
							<ion-row>
								<ion-col width-90  >
                                    <ion-item *ngIf="!displayCode && (tag | displayPresetLabel)" (click)="emitOpenModal(tag)">
                                        <p>{{ (tag | displayPresetLabel)?.lbl }} </p>
                                    </ion-item>
                                   
                                    <ion-item *ngIf="displayCode || !(tag | displayPresetLabel)" style="padding-left: 0px">
                                         <ion-label color="primary"> <i class="fa fa-code"></i> </ion-label>
										<ion-input type="text" [(ngModel)]="tag.value" [placeholder]="tag.key"></ion-input>
									</ion-item>
                                </ion-col>
								<ion-col width-10 class="ion-col10">
									<i (click)="tag.value = ''" class="fa fa-times fa-2x"></i>
								</ion-col>
							</ion-row>
						</ion-grid>
                        </ion-card-content>
                    </ion-card>



                    <ion-card *ngIf="tag.preset?.type === 'number'">
                        <ion-card-header>
                        	<b *ngIf="!displayCode">{{tag.preset?.lbl}}</b>
						    <b *ngIf="displayCode"> <i class="fa fa-code" ></i> {{tag.preset?.key}}</b>
                        </ion-card-header>

                        <ion-card-content>
                        <ion-grid>
							<ion-row>
								<ion-col width-90>
                                	<ion-item style="padding-left: 0px">
										<ion-input type="number" [(ngModel)]="tag.value" [placeholder]="tag.key"></ion-input>
									</ion-item>
                               
                                </ion-col>
								<ion-col width-10 class="ion-col10">
									<i (click)="tag.value = ''" class="fa fa-times fa-2x"></i>
								</ion-col>
							</ion-row>
						</ion-grid>
                        </ion-card-content>
                    </ion-card>



                    <ion-card *ngIf="tag.preset?.type === 'text'">
                        <ion-card-header>
                            <b *ngIf="!displayCode">{{ tag.preset?.lbl }}</b>
                            <b *ngIf="displayCode"> <i class="fa fa-code" ></i> {{ tag.preset?.key }}</b>
                        </ion-card-header>

                        <ion-card-content>
                        <ion-grid>
							<ion-row>
								<ion-col width-90>
                                	<ion-item style="padding-left: 0px">
										<ion-input type="text" [(ngModel)]="tag.value" [placeholder]="tag.key"></ion-input>
									</ion-item>
                                </ion-col>
								<ion-col width-10 class="ion-col10">
									<i (click)="tag.value = ''" class="fa fa-times fa-2x"></i>
								</ion-col>
							</ion-row>
						</ion-grid>
                        </ion-card-content>
                    </ion-card>
  `
})
export class EditPresets {
    @Input() displayCode;
    @Input() tag;

    @Output() openPrimaryListModal = new EventEmitter();

    emitOpenModal(tag){
        if (!this.displayCode && this.tag.preset.type == 'list'){
              this.openPrimaryListModal.emit(tag);
        }
    }
}