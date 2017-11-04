import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

import { CookieService } from "angular2-cookie/core";
import * as adminModel from "./models";

@Injectable()
export class UploadService {
    private updloadUrl = "/api/adminusers/avatar";
    private csrfToken: string;

    constructor(
        private http: Http,
        private cookieService: CookieService
    ) {
        this.csrfToken = this.cookieService.get("XSRF-TOKEN");
    }

    public uploadUserAvatar(event: any): Observable<adminModel.UploadResult> {
        const fi = event.srcElement;
        if (!fi.files || !fi.files[0]) {
            return;
        }

        const fileToUpload = fi.files[0];
        const formData: FormData = new FormData();
        formData.append(fileToUpload.name, fileToUpload);

        const headers = new Headers();
        headers.set("Accept", "application/json");
        headers.set("X-XSRF-TOKEN", this.csrfToken);

        return this.http.post(this.updloadUrl, formData, { headers: headers })
            .map((res: Response) => res.json())
            .catch((error: any) => {
                console.log("error", error);
                return Observable.throw(JSON.stringify(error) || "Server error");
            });
    }
}


