import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-chess-feed',
  templateUrl: './chess-feed.component.html',
  styleUrls: ['./chess-feed.component.css']
})
export class ChessFeedComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub!: Subscription;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    // Fetch all posts at once (e.g., pass large values to get everything)
    this.postsService.getPosts(1000, 1); 
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
