import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {

    }

    createAndStorePost(title: string, content: string) {
        const postData: Post = { title: title, content: content }
        this.http
            .post<{ name: string }>(
                'https://ng-complete-guide-2d2c8-default-rtdb.firebaseio.com/posts.json',
                postData
            )
            .subscribe(responseData => {
                console.log(responseData);
            }, error => {
                this.error.next(error.message);
            });
    }

    fetchPosts() {
        return this.http.get<{ [key: string]: Post }>('https://ng-complete-guide-2d2c8-default-rtdb.firebaseio.com/posts.json', {
            headers: new HttpHeaders({ "Custom-Header": "hello" }),
            params: new HttpParams().set('print', 'pretty')
        }).pipe(map((responseData) => {
            const postArray: Post[] = [];
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    postArray.push({ ...responseData[key], id: key });
                }
            }
            return postArray;
        }), catchError(errorRes => {
            // Error task t server
            return throwError(errorRes);
        }));
    }

    deletePosts() {
        return this.http.delete<{ name: string }>('https://ng-complete-guide-2d2c8-default-rtdb.firebaseio.com/posts.json')
    }
}