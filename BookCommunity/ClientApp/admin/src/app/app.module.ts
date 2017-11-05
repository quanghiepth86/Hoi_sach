import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app.routing.module";

import { UserService } from "./services/user.service";
import { UploadService } from "./services/upload.service";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
