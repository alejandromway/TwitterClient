import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../types/tweets.types';

@Pipe({
  name: 'sorttweets',
})
export class SorttweetsPipe implements PipeTransform {

  transform(value: Array<Status>, sortBy: 'date' | 'author' = 'date') {
    return value.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'author') {
        if (a.user.name < b.user.name) return -1;
        if (a.user.name > b.user.name) return 1;
        return 0;
      }
    })
  }
}