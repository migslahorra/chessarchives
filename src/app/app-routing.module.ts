import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from 'backend/authentication/signup/signup.component';
import { SignInComponent } from 'backend/authentication/signin/signin.component';
import { AuthGuard } from 'backend/authentication/auth.guard';
import { AboutComponent } from './about/about.component';
import { GithubComponent } from './github/github.component';
import { ChessFeedComponent } from './chess-feed/chess-feed.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'home', component: HomeComponent
  },

  {
    path: 'signin', component: SignInComponent
  },

  {
    path: 'signup', component: SignUpComponent
  },

  {
    path: 'about', component: AboutComponent
  },

  {
    path: 'github', component: GithubComponent
  },

  {
    path: 'chess-feed', component: ChessFeedComponent
  },

  {
    path: 'post-create', component: PostCreateComponent
  },

  {
    path: 'post-list', component: PostListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]  
})
export class AppRoutingModule { }
