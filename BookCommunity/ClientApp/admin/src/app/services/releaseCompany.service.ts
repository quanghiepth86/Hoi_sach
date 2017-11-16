import { Injectable } from "@angular/core";
import { Http, Response, URLSearchParams, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/combineLatest";
import "rxjs/add/observable/throw";

import { CookieService } from "angular2-cookie/core";
import { ListResponse, GetReleaseCompaniesParams, Avatar, ReleaseCompany } from "./models";
import { BaseService } from "./base.service";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ReleaseCompanyService extends BaseService {
    private releaseCompanyUrl = "/api/releasecompanies";
    private csrfToken: string;

    constructor(
        private http: Http,
        private cookieService: CookieService
    ) {
        super();
        this.csrfToken = this.cookieService.get("XSRF-TOKEN");
    }

    public getReleaseCompany(releaseCompanyId: string): Observable<ReleaseCompany> {
        const url = `${this.releaseCompanyUrl}/${releaseCompanyId}`;
        return this.http.get(url)
            .map((res: Response) => res.json())
            .catch((error: Response) => Observable.throw(error || "Server error"));
    }

    public getReleaseCompanies(params: GetReleaseCompaniesParams): Observable<ListResponse<ReleaseCompany>> {
        const url = `${this.releaseCompanyUrl}?${this.joinUrlParams(params)}`;
        return this.http.get(url)
            .map((res: Response) => res.json())
            .catch((error: Response) => Observable.throw(error || "Server error"));
    }

    public addReleaseCompany(author: ReleaseCompany): Observable<ReleaseCompany> {
        const headers = new Headers();
        headers.set("X-XSRF-TOKEN", this.csrfToken);

        return this.http.post(this.releaseCompanyUrl, author, { headers: headers })
            .map((res: Response) => res)
            .catch((error: Response) => Observable.throw(error || "Server error"));
    }

    public updateReleaseCompany(releaseCompanyId: string, payload: ReleaseCompany): Observable<ReleaseCompany> {
        const headers = new Headers();
        headers.set("X-XSRF-TOKEN", this.csrfToken);
        const url = `${this.releaseCompanyUrl}/${releaseCompanyId}`;

        return this.http.put(url, payload, { headers: headers })
            .map((res: Response) => res)
            .catch((error: Response) => Observable.throw(error || "Server error"));
    }

    public deleteReleaseCompany(authorId: string): Observable<Response> {
        const headers = new Headers();
        headers.set("X-XSRF-TOKEN", this.csrfToken);
        const deleteUrl = `${this.releaseCompanyUrl}/${authorId}`;

        return this.http.delete(deleteUrl, { headers: headers })
            .map((res: Response) => res);
    }

    public deleteReleaseCompanies(releaseCompanyIds: string[]): Observable<void> {
        const requests = releaseCompanyIds.map(a => this.deleteReleaseCompany(a));
        return Observable.combineLatest(requests)
            .catch((error: Response) => Observable.throw(error || "Server error"));
    }

    public removePicture(fileName: string): Observable<Response> {
        const headers = new Headers();
        headers.set("X-XSRF-TOKEN", this.csrfToken);
        const url = `${this.releaseCompanyUrl}/logos/remove`;
        const payload: Avatar = {
            fileName: fileName
        };

        return this.http.post(url, payload, { headers: headers })
            .map((res: Response) => res)
            .catch((error: Response) => Observable.throw(error || "Server error"));
    }
}



