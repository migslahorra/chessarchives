import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// This imports are for routing //
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { GithubComponent } from './github/github.component';
import { SignUpComponent } from 'backend/authentication/signup/signup.component';
import { SignInComponent } from 'backend/authentication/signin/signin.component';
import { ChessFeedComponent } from './chess-feed/chess-feed.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { AuthInterceptor } from 'backend/authentication/auth-interceptor'; // Added AuthInterceptor import
import { ErrorInterceptor } from './error-interceptor'; // Existing ErrorInterceptor import
import { AuthGuard } from 'backend/authentication/auth.guard';
import { UploadComponent } from './posts/upload/upload.component';
import { UploadsComponent } from './posts/uploads/uploads.component';

// This imports are for angular materials //
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { PdfUploadComponent } from './pdf/pdf-upload/pdf-upload.component';
import { PdfViewerComponent } from './pdf/pdf-viewer/pdf-viewer.component';
import { FileSizePipe } from './pdf/pdf-upload/file-size.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    GithubComponent,
    SignUpComponent,
    SignInComponent,
    ChessFeedComponent,
    UploadComponent,
    UploadsComponent,
    PdfUploadComponent,
    PdfViewerComponent,
    FileSizePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  providers: [
    // Provide the AuthInterceptor first, then the ErrorInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard
  ],  
  bootstrap: [AppComponent]
})
export class AppModule { }