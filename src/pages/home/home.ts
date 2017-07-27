import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonicPage, AlertController } from 'ionic-angular';

import { TwitterService, IStatus } from '../../services/twitter.service';
 
import { TweetsList } from '../../components/TweetsList/TweetsList.component'
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  tweets: Array<IStatus> = [];

  @ViewChild(TweetsList)
  private tweetsListComponent: TweetsList;

  private nextTweetsQueryPath: string = null;

  private searchTerm: string = '#angular';

  public sortBy: 'author' | 'date' = 'date';

  constructor(public navCtrl: NavController, private twitterService: TwitterService, private network: Network, public alertCtrl: AlertController) {
    this.network.onDisconnect().subscribe(() => {
      this.checkConnection(true);
    });
  }

  ngOnInit() {
    this.twitterService
      .issueToken()
      .subscribe(() => {
        this.fetchTweets();
        setInterval(() => this.fetchTweets(), 15000)
      })
  }
 
  fetchTweets(updateNextPath: boolean = true) {
    this.twitterService
       .search(this.searchTerm)
      .subscribe(result => {
        if (!result.search_metadata.next_results) {
          console.error('result.search_metadata.next_results empty', result.search_metadata);
        }
        this.tweets = result.statuses
        this.nextTweetsQueryPath = updateNextPath ? result.search_metadata.next_results : this.nextTweetsQueryPath;
      });
  }

  doRefresh(refresher) {
    console.log('ptr');
    this.twitterService.search(this.searchTerm)
      .subscribe(result => {
        if (!result.search_metadata.next_results) {
          console.error('result.search_metadata.next_results empty', result.search_metadata);
        }
        this.tweetsListComponent.clearAllTweets();
        this.tweets = result.statuses
        this.nextTweetsQueryPath = result.search_metadata.next_results;
        refresher.complete();
      });
  }

  checkConnection(offline: boolean) {
    let alert = this.alertCtrl.create({
      title: 'Connection',
      subTitle: offline ? 'Device offline' : 'Connection type: ' + this.network.type,
      buttons: ['Ok']
    });
    alert.present();
  }

  checkSorting() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Sort list by');

    alert.addInput({
      type: 'radio',
      label: 'Author',
      value: 'author',
      checked: this.sortBy === 'author'
    });

    alert.addInput({
      type: 'radio',
      label: 'Date',
      value: 'date',
      checked: this.sortBy === 'date'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.sortBy = data;
      }
    });
    alert.present();
  }

  searchTwitter = (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }
    this.twitterService.search(searchTerm)
      .subscribe(result => {
        if (!result.search_metadata.next_results) {
          console.error('result.search_metadata.next_results empty', result.search_metadata);
        }
        this.searchTerm = searchTerm;
        this.tweetsListComponent.clearAllTweets();
        this.tweets = result.statuses
        this.nextTweetsQueryPath = result.search_metadata.next_results;
      });
  }
}