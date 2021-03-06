import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { AuthorService } from "../../../services/author.service";
import {
    Author,
    ResponseNotify,
    GetAuthorsParams,
    ListResponse,
    ErrorInfo
} from "../../../services/models";

@Component({
  selector: "app-author-list",
  templateUrl: "./author.list.component.html",
  styleUrls: ["./author.list.component.css"]
})
export class AuthorListComponent implements OnInit {
    public authorList: ListResponse<Author>;
    public responseNotify: ResponseNotify;
    public page = 1;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authorService: AuthorService
    ) {
     }

    ngOnInit() {
        const params: GetAuthorsParams = {
            offset: 0,
            limit: 10
        };
        this.authorService.getList<Author>(params).subscribe((result) => {
            if (!result.items) {
                return;
            }

            const extAuthors = result.items.map(item => <Author>item);
            this.authorList = {
                count: result.count,
                items: extAuthors
            };
        });
    }

    public addAuthor(): void {
        this.router.navigate(["/admin/authors"])
            .then(() => this.router.navigate(["/admin/authors/add"], { replaceUrl: true }));
    }

    public deleteAuthor(): void {
        const deletedAuthorIds = this.authorList.items.filter(c => c.isChecked).map(c => c.id);
        this.authorService.deleteMany(deletedAuthorIds).subscribe((data) => {
            this.authorList.items = this.authorList.items.filter(u => !deletedAuthorIds.includes(u.id, 0));
            this.authorList.count = this.authorList.count - deletedAuthorIds.length;
            this.responseNotify = {
                isSuccess: true,
                message: "Authors have delete successfuly"
            };
        },
        (err: ErrorInfo) => {
            this.responseNotify = {
                isSuccess: false,
                message: err.message
            };
        });
    }

    public pageChanged($event): void {
        const limit = 10;
        this.page = +$event;
        const params: GetAuthorsParams = {
            offset: (this.page - 1) * limit,
            limit: limit
        };

        this.authorService.getList<Author>(params).subscribe((result) => {
            this.authorList = result;
        });
    }
}
