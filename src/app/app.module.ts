import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// This is for routing imports //
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from 'backend/authentication/auth-interceptor';
import { SignUpComponent } from 'backend/authentication/signup/signup.component';
import { SignInComponent } from 'backend/authentication/signin/signin.component';
import { AboutComponent } from './about/about.component';
import { GithubComponent } from './github/github.component';
import { FooterComponent } from './footer/footer.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

// This is for material imports //
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    AboutComponent,
    GithubComponent,
    SignUpComponent,
    SignInComponent,
    FooterComponent,
    PostCreateComponent,
    PostListComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatProgressBarModule,
    MatExpansionModule
    
  ],
  providers: [{provide: HTTP_INTERCEPTORS,   
  useClass:AuthInterceptor, multi: true}],  
  bootstrap: [AppComponent],
})
export class AppModule { }
