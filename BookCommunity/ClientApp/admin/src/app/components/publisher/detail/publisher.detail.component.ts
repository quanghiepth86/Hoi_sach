import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { CountryService } from "../../../services/country.service";
import { PublisherService } from "../../../services/publisher.service";
import { UploadService } from "../../../services/upload.service";
import { Publisher, Country, ResponseNotify, ErrorInfo } from "../../../services/models";

@Component({
    selector: "app-publisher-detail",
    templateUrl: "./publisher.detail.component.html",
    styleUrls: ["./publisher.detail.component.css"]
})
export class PublisherDetailComponent implements OnInit {
    public publisherForm: FormGroup;
    public responseNotify: ResponseNotify;
    public countries: Country[];
    public publisherId: string;
    public publisher: Publisher;

    private uploadedFileName: string;

    name: FormControl;
    logo: FormControl;
    countryId: FormControl;
    isActive: FormControl;

    constructor(
        private publisherService: PublisherService,
        private countryService: CountryService,
        private uploadService: UploadService,
        protected fb: FormBuilder,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.createFormControls();
        this.createForm();
        this.countryService.getList<Country>({ offset: 0 }).subscribe(result => {
            this.countries = result.items;
        });
        this.route.params.subscribe(params => {
            if (!params["id"]) {
                return;
            }

            this.publisherId = params["id"];
            this.publisherService.get<Publisher>(this.publisherId).subscribe(data => {
                this.publisher = data;
                this.fillPublisher(data);
            });
        });
    }

    public savePublisher(): void {
        if (this.publisherForm.invalid) {
            return;
        }

        this.saveOrUpdate();
    }

    public onFileChange(event: any): void {
        const apiUrl = "/api/admin/publishers/logos";
        this.uploadService.uploadFile(event, apiUrl).subscribe((result) => {
            this.uploadedFileName = result.fileName;
        });
    }

    public removeLogo(): void {
        const apiUrl = "/api/admin/publishers/logos/remove";
        this.uploadService.removeFile(this.uploadedFileName, apiUrl).subscribe(data => {
        },
        (err: ErrorInfo) => {
            this.responseNotify = {
                isSuccess: false,
                message: `Remove logo error: ${err.message}`
            };
        });
        this.uploadedFileName = "";
    }

    private saveOrUpdate(): void {
        if (this.publisherId) {
            this.updatePublisher();
        } else {
            this.addPublisher();
        }
    }

    private addPublisher(): void {
        const selectedCountry = this.countries.find(c => c.id === this.countryId.value);
        const publisher: Publisher = {
            name: this.name.value,
            logo: this.uploadedFileName,
            country: selectedCountry,
            isActive: this.isActive.value || false,
        };

        this.publisherService.add(publisher).subscribe((data) => {
            this.responseNotify = {
                isSuccess: true,
                message: "Publisher has been added successfuly"
            };
        },
        (err: ErrorInfo) => {
            this.responseNotify = {
                isSuccess: false,
                message: err.message
            };
        });
    }

    private updatePublisher(): void {
        const selectedCountry = this.countries.find(c => c.id === this.countryId.value);
        const payload: Publisher = {
            name: this.name.value,
            logo: this.uploadedFileName,
            country: selectedCountry,
            isActive: this.isActive.value || false
        };

        this.publisherService.update(this.publisherId, payload)
            .subscribe((data) => {
                this.responseNotify = {
                    isSuccess: true,
                    message: "Publisher has been updated successfuly"
                };
            },
            (err: ErrorInfo) => {
                this.responseNotify = {
                    isSuccess: false,
                    message: err.message
                };
            });
    }

    private createFormControls() {
        this.name = new FormControl("", Validators.required);
        this.logo = new FormControl("");
        this.countryId = new FormControl("", Validators.required);
        this.isActive = new FormControl(false);
    }

    private fillPublisher(publisher: Publisher) {
        if (!publisher) {
            return;
        }

        this.name.setValue(publisher.name);
        this.uploadedFileName = publisher.logo;
        this.countryId.setValue(publisher.country.id);
        this.isActive.setValue(publisher.isActive);
    }

    private createForm() {
        this.publisherForm = this.fb.group({
            name: this.name,
            logo: this.logo,
            countryId: this.countryId,
            isActive: this.isActive
        });
    }

    public clearForm() {
        this.uploadedFileName = "";
        this.publisherForm.reset();
        this.countryId.setValue("");
    }
}
