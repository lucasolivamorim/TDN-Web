import { Component, OnInit } from '@angular/core';
import {Post} from '../model/post.model';
import {PostService} from "./post.service";
import {PageEvent} from "@angular/material";
import {User} from "../../model/user.model";
import {UserService} from "../user/user.service";
import {Like} from "../../model/like.model";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  length = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 100];
  pageIndex = 0;
  pageEvent: PageEvent = new PageEvent;

  authenticatedUser: User = new User();
  postObj: Post = new Post();
  posts: Post[] = [];

  constructor(private postService: PostService, private userService: UserService) {
    this.userService.getAuthenticatedUser().subscribe(user => {
      this.authenticatedUser = user;
    });
    this.postService.getPostCount().subscribe(postCount => {
      this.length = postCount['postCount'];
      console.log('There are:', this.length, 'posts');
    });
    this.postService.getPosts(this.pageSize, this.pageIndex * this.pageSize).subscribe(posts => {
      console.log('Posts:', posts);
      this.posts = posts;
    });
  }

  post() {
    this.postService.setPost(this.postObj).subscribe((newPost: Post) => {
      console.log('NewPost', newPost);
      this.posts.unshift(newPost);
      this.length ++;
    });
  }

  ngOnInit() {
  }

  alterPage() {
    console.log('Getting new page');
    this.postService.getPosts(this.pageEvent.pageSize, this.pageEvent.pageIndex * this.pageEvent.pageSize).subscribe(posts => {
      console.log('Posts:', posts);
      this.posts = posts;
    });
  }

  toggleLike(post: Post) {
    let like = new Like();
    like.post = post;
    console.log(like);
    this.postService.setLike(like).subscribe((newPost: Post) => {
      const idx = this.posts.indexOf(post, 0);
      this.posts[idx] = newPost;
      console.log('Liked:', this.posts[idx]);
    });
  }

  getLikeText(post: Post) {
    if (post.hasLiked) {
      return 'Dislike';
    } else {
      return 'Like';
    }
  }

  onKeyPress($event) {
    if ($event.keyCode === 13) {
      this.post();
    }
  }
}
