import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { GithubComponent } from './github/github.component';
import { SignUpComponent } from 'backend/authentication/signup/signup.component';
import { SignInComponent } from 'backend/authentication/signin/signin.component';
import { ChessFeedComponent } from './chess-feed/chess-feed.component';
import { AuthGuard } from 'backend/authentication/auth.guard';
import { UploadComponent } from './posts/upload/upload.component';
import { UploadsComponent } from './posts/uploads/uploads.component';
import { PdfUploadComponent } from './pdf/pdf-upload/pdf-upload.component';
import { PdfViewerComponent } from './pdf/pdf-viewer/pdf-viewer.component';

const routes: Routes = [
  {
    path: 'home', component: HomeComponent 
  },

  {
    path: 'about', component: AboutComponent
  },

  {
    path: 'github', component: GithubComponent
  },

  {
    path: 'signup', component: SignUpComponent
  },

  {
    path: 'signin', component: SignInComponent
  },

  {
    path: 'upload', component: UploadComponent, canActivate: [AuthGuard]
  },

  {
    path: 'uploads', component: UploadsComponent, canActivate: [AuthGuard]
  },

  {
    path: 'chess-feed', component: ChessFeedComponent, canActivate: [AuthGuard]
  },

  {
    path: 'pdf-upload', component: PdfUploadComponent, canActivate: [AuthGuard]
  },

  {
    path: 'pdf-viewer', component: PdfViewerComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
