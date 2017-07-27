import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const TWITTER_APP = 'YOUR APP KEY';
const TWITTER_SECRET = 'YOUR SECRET KEY';

export interface ISearchMetadata {
    completed_in: number;
    count: number;
    max_id: number;
    max_id_str: string;
    next_results: string;
    query: string;
    refresh_url: string;
    since_id: number;
    since_id_str: string;
}

export interface IStatus {
    contributors?: any;
    coordinates?: any;
    created_at?: string
    entities?: any;
    favorite_count?: number;
    favorited?: boolean;
    geo?: any;
    id?: number
    id_str?: string;
    in_reply_to_screen_name?: any;
    in_reply_to_status_id?: any;
    in_reply_to_status_id_str?: any;
    in_reply_to_user_id?: any;
    in_reply_to_user_id_str?: any;
    is_quote_status?: boolean;
    lang?: string;
    metadata?: any;
    place?: any;
    retweet_count?: number;
    retweeted?: boolean;
    retweeted_status?: any;
    source?: string;//link
    text: string;
    truncated?: boolean;
}

export interface ISearchResult {
    search_metadata: ISearchMetadata;
    statuses: Array<IStatus>;
}

@Injectable()

export class TwitterService {
    private tokenCredentials = window.btoa(TWITTER_APP + ':' + TWITTER_SECRET)
    private retrievedAccessToken: string = null;

    constructor(public http: Http) {

    }

   search(phrase: string = '#angular'): Observable<ISearchResult> {
        const s = `https://api.twitter.com/1.1/search/tweets.json?q=${encodeURIComponent(phrase)}`;
        return this.http.get(s, { headers: this.getHeadersWithAccessToken() })
            .map(res => res.json())
            .map((data: ISearchResult) => {
                return data;
            });
    }

    private getHeadersWithAccessToken() {
        return new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.retrievedAccessToken
        });
    }

    issueToken() {
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Basic ' + this.tokenCredentials
        });
        return this.http.post('https://api.twitter.com/oauth2/token', 'grant_type=client_credentials', {
            headers
        })
            .map(res => res.json())
            .map(data => this.retrievedAccessToken = data.access_token);
    }
} 