import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { GetUserService } from '../fetch-api-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  constructor(
    public router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public fetchApiData: GetUserService,
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  logoutUser(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
    this.snackBar.open("You've been logged out", 'OK', {
      duration: 2000,
    });
  }

  showProfileDialog(
    Username: string,
    Password: string,
    Email: string,
    Birthday: string
  ): void {
    this.dialog.open(ProfileViewComponent, {
      data: { Username, Password, Email, Birthday },
      width: '350px',
    });
  }

  getUser(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
        this.userData = resp;
        console.log(this.userData);
        return this.userData;
      });
    }

}
