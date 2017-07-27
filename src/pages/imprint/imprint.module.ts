import { NgModule } from '@angular/core';
import { ImprintPage } from './imprint';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [ImprintPage],
    imports: [IonicPageModule.forChild(ImprintPage)],
})
export class ImprintPageModule { }