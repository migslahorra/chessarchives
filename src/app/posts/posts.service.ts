import { Injectable } from "@angular/core";
import { Subject, Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient) {}

  getPosts(pagesize: number, currentpage: number) {
    const queryParams = `?pagesize=${pagesize}&currentpage=${currentpage}`;
    this.http.get<{ message: string; posts: any[]; maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => ({
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator
            })),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostsData => {
        console.log(transformedPostsData);
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<{ 
      id: string; 
      title: string; 
      content: string; 
      imagePath: string; 
      creator: string; 
    }>(`http://localhost:3000/api/posts/${id}`)
      .pipe(
        map(postData => ({
          id: postData.id,
          title: postData.title,
          content: postData.content,
          imagePath: postData.imagePath,
          creator: postData.creator
        })),
        catchError(error => {
          console.error("Error fetching post:", error);
          return throwError(() => error);
        })
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, image.name);

    this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(responseData => {
        const newPost: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
          creator: responseData.post.creator  // ✅ Include creator in post object
        };
        this.posts.push(newPost);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.posts.length
        });
      }, error => {
        console.error("Error creating post:", error);
      });
  }

  updatePost(id: string, title: string, content: string, image?: File | string) {
  let postData: FormData | Partial<Post>;

  if (typeof image === "object") {
    postData = new FormData();
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, image.name); // Add the new image to the form data
  } else {
    // If no image is provided, send the image path (or empty string if no image)
    postData = { id, title, content, imagePath: image || '' };
  }

  this.http.put<{ message: string; imagePath: string }>(`http://localhost:3000/api/posts/${id}`, postData)
    .subscribe(response => {
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
      updatedPosts[oldPostIndex] = {
        ...updatedPosts[oldPostIndex],
        title,
        content,
        imagePath: response.imagePath || (typeof image === 'string' ? image : '')
      };

      this.posts = updatedPosts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: this.posts.length
      });
    }, error => {
      console.error("Error updating post:", error);
    });
}

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
  }
}