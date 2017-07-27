import { Component, Input, OnInit, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IStatus } from '../../services/twitter.service';

@Component({
    selector: 'tweets-list',
    templateUrl: 'TweetsList.html'
})
export class TweetsList implements OnInit, OnChanges {

    private _tweets: Array<IStatus> = [];
    @Input()
    private tweets: Array<IStatus> = [];

    private tweetBuffer: Array<IStatus> = [];

    private isLoading: boolean = false;

    private term: string = '';
    private searchOnline: boolean = false;
    public searchSegmentValue: string = "false";

    @Input()
    private sortBy: 'date' | 'author';

    @Input() searchTwitter: Function = () => { };
    @ViewChild('searchbar') searchbarInput;

    constructor(public navCtrl: NavController) {
    }

    private flushBuffer() {
        this._tweets = [...this.tweetBuffer, ...this._tweets];
        this.tweetBuffer = [];
    }

    ngOnInit() {
        this.isLoading = true;
    }

    showDetail(tweet: IStatus) {
        this.navCtrl.push('TweetDetailPage', {
            ...tweet
        })
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.isLoading = false;
        
        if (changes.tweets && !changes.tweets.firstChange) {
            this.handleTweetsChange(changes.tweets);
        }
    }

    private getOutersection(newList, oldList) {
        return newList.filter(tweet => !oldList.some(existingTweet => existingTweet.id === tweet.id))
    }

    private handleTweetsChange(tweetChange) {
        if (!this._tweets.length) {
            return this._tweets = tweetChange.currentValue;
        }
        const newTweetsList = this.getOutersection(tweetChange.currentValue, this._tweets)
        const newTweetsBuffer = this.getOutersection(newTweetsList, this.tweetBuffer)
        this.tweetBuffer = [...newTweetsBuffer, ...this.tweetBuffer]
    }

    public searchFn(input) {
        this.term = input.target.value;
        if (this.searchOnline) {
            return this.searchTwitter(this.term);
        }
    }

    public toggleSearchOnline() {
        this.searchOnline = !this.searchOnline;
        if (this.searchOnline) {
            this.clearAllTweets();
            this.searchTwitter(this.searchbarInput.value);
        }
    }

    public clearAllTweets(): void {
        this._tweets = [];
        this.tweetBuffer = [];
    }
}