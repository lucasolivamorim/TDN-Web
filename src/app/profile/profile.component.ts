import { Component, OnInit } from '@angular/core';
import {User} from '../model/user.model';
import {UserService} from '../user/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isLoggedUser = false;
  user: User = new User();

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isLoggedUser = id == null;
    if (this.isLoggedUser) {
      this.userService.getAuthenticatedUser().subscribe(user => {
        this.user = user;
        if (this.user.background == null) {
          this.user.background = 'http://2.bp.blogspot.com/-91pJBele_kY/U7e13L_b7KI/AAAAAAAAMNI/HgViWJhc6hY/s0/shiro-chibi-jibril-stephanie+dora-sora-q-chiang-1920x1080.jpg';
        }
      });
    } else {
      this.userService.getUser(id).subscribe(user => {
        this.user = user;
        if (this.user.background == null) {
          this.user.background = 'https://2.bp.blogspot.com/-91pJBele_kY/U7e13L_b7KI/AAAAAAAAMNI/HgViWJhc6hY/s0/shiro-chibi-jibril-stephanie+dora-sora-q-chiang-1920x1080.jpg';
        }
      });
    }
  }

  isFollowing(user: User) {
    return this.user.isFollowing;
  }

  getFollowingText() {
    if (this.isFollowing(this.user)) {
      return ('Unfollow');
    } else {
      return('Follow');
    }
  }

  toggleFollow() {
    if (this.isFollowing(this.user)) {
      this.userService.deleteFollow(this.user.id);
      this.user.isFollowing = false;
    } else {
      this.userService.setFollow(this.user.id);
      this.user.isFollowing = true;
    }
  }
}