import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'backend/authentication/auth.service'; // ✅ FIXED: Import AuthService

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit, OnDestroy {
  totalposts = 10;
  postperpage = 2;
  currentpage = 1;
  pageSizeOption = [1, 2, 5, 10];
  posts: Post[] = [];

  private postsSub!: Subscription;
  private authStatusSub!: Subscription;

  editedPostId: string | null = null;
  imagePreview: string | null = null;
  selectedImage: File | null = null;
  editablePost: { title: string; content: string; imagePath?: string } = { title: '', content: '' };

  userIsAuthenticated = false;
  userId: string | null = null;  // Store userId of logged-in user
  postOwners: { [postId: string]: boolean } = {};  // Map to track whether the logged-in user is the creator

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();  // Get the logged-in user's ID
    this.postsService.getPosts(this.postperpage, this.currentpage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalposts = postData.postCount;
        
        // Check if the logged-in user is the creator of each post
        this.posts.forEach(post => {
          this.postOwners[post.id] = post.creator === this.userId;
        });
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onEdit(post: Post) {
    if (!this.postOwners[post.id]) {
      alert("You are not authorized to edit this post.");
      return;
    }

    this.editedPostId = post.id;
    this.editablePost = { title: post.title, content: post.content, imagePath: post.imagePath };
    this.imagePreview = post.imagePath;
  }

  onDelete(postId: string) {
    if (!this.postOwners[postId]) {
      alert("You are not authorized to delete this post.");
      return;
    }

    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postperpage, this.currentpage);
      });
  }

  onImagePicked(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0] || null;

    if (!file) {
      console.error('No file selected');
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveEdit(postId: string) {
    if (!this.editablePost.title || !this.editablePost.content) return;

    this.postsService.updatePost(
      postId,
      this.editablePost.title,
      this.editablePost.content,
      this.selectedImage || undefined
    );

    this.editedPostId = null;
    this.imagePreview = null;
  }

  onChangedPage(pageData: PageEvent) {
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentpage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
