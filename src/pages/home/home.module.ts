import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { TweetsList } from '../../components/TweetsList/TweetsList.component';
import { LinkyModule } from 'angular-linky';
import { Network } from '@ionic-native/network';
import { SearchPipe } from '../../pipes/search/search';
import { SorttweetsPipe } from '../../pipes/sorttweets/sorttweets';

@NgModule({
    declarations: [HomePage, TweetsList, SearchPipe, SorttweetsPipe],
    imports: [IonicPageModule.forChild(HomePage), LinkyModule],
    providers: [Network],
})
export class HomePageModule { }