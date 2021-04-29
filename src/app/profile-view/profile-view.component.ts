import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { ProfileUpdateComponent } from '../profile-update/profile-update.component';
import {
  EditUserService,
  GetUserService,
  GetAllMoviesService,
  GetFavoriteMoviesService,
  RemoveFavoriteMovieService,
  DeleteUserService,
} from '../fetch-api-data.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };
  movies: any[] = [];
  favoriteMovies: any[] = [];
  favoriteMoviesIDs: any[] = [];

  constructor(
    public fetchApiData: EditUserService,
    public fetchApiDataAllMovies: GetAllMoviesService,
    public fetchApiDataUser: GetUserService,
    public fetchApiDataFavoriteMovies: GetFavoriteMoviesService,
    public fetchApiDataDeleteUser: DeleteUserService,
    public fetchApiDataDeleteFavorite: RemoveFavoriteMovieService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Username: string;
      Password: string;
      Email: string;
      Birthday: Date;
    }
  ) {}

  /**
   * gets user favorites and user data on init
   */
  ngOnInit(): void {
    this.getFavoriteMovies();
    this.getUser();
  }

  /**
   * gets data for all movies
   */
  getMovies(): void {
    this.fetchApiDataAllMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.movies.forEach((movie) => {
        if (this.favoriteMoviesIDs.includes(movie._id))
          this.favoriteMovies.push(movie);
      });
      return this.favoriteMovies;
    });
  }

  /**
   * gets user data 
   */
  getUser(): void {
    this.fetchApiDataUser.getUser().subscribe((resp: any) => {
        this.userData = resp;
        console.log(this.userData);
        return this.userData;
      });
    }

  /**
   * Function to open dialog showing movie details
   * @param Description type: string - Movie description
   * @param Image type: string - Path to movie image
   * @param Title type: string - Movie title
   */
  openDetailsDialog(Description: string, Image: string, Title: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: { Description, Image, Title },
      width: '400px',
      height: '400px',
    });
  }

  /**
   * Function to open dialog showing genre details
   * @param Name type: string - Name of genre
   * @param Description type: string - Description of genre
   */
  openGenreDialog(Name: string, Description: string): void {
    this.dialog.open(MovieCardComponent, {
      data: { Name, Description },
      width: '400px',
      height: '400px',
    });
  }

  /**
   * Function to open dialog showing director details
   * @param Name type: string - Name of director
   * @param Bio type: string - Director bio
   * @param BirthYear type: string - Year director was born
   */
  openDirectorDialog(Name: string, Bio: string, BirthYear: string): void {
    this.dialog.open(DirectorViewComponent, {
      data: { Name, Bio, BirthYear },
      width: '400px',
      height: '400px',
    });
  }

  /**
  * Function that allows the user to update their profile information
  */
  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (result) => {
        console.log(result);
        this.snackbar.open('Your profile has been updated.', 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (result) => {
        this.snackbar.open(result, 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
    localStorage.clear();
    this.router.navigate(['welcome']);
  }

  /**
  * Function that allows the user to delete their profile
  */
  deleteUser(): void {
    this.fetchApiDataDeleteUser.deleteUser().subscribe(
      (result) => {
        console.log(result);
        this.snackbar.open('Your profile has been deleted.', 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      },
      (result) => {
        this.snackbar.open(result, 'OK', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
    localStorage.clear();
    this.router.navigate(['welcome']);
  }

  /**
   * Function to get user's favorite movies
   * @returns favoriteMovieIDs - IDs of user's favorite movies
   */
  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.fetchApiDataUser.getUser().subscribe((resp: any) => {
        this.favoriteMoviesIDs = resp.FavoriteMovies;

        if (this.favoriteMoviesIDs.length === 0) {
          let noFavorites = document.querySelector(
            '.no-favorites'
          ) as HTMLDivElement;
          noFavorites.innerHTML = "You don't have any favorite movies!";
        }

        return this.favoriteMoviesIDs;
      });
    }
    setTimeout(() => {
      this.getMovies();
    }, 100);
  }

  /**
   * Function that checks whether a user no longer has favorite movies after
   * a favorite is deleted. If no cards remain with the "active" class, text
   * is displayed to let the user know they do not have any favorites.
   */
  checkNoFavorites() {
    let container = document.querySelector('.container') as HTMLDivElement;
    let noFavorites = document.querySelector('.no-favorites') as HTMLDivElement;
    if (container.querySelectorAll('.active').length < 1)
      noFavorites.innerHTML = "You don't have any favorite movies!";
  }


  /**
   * function to remove user favorites
   */
  removeFromFavorites(id: string, title: string): void {
    this.fetchApiDataDeleteFavorite.deleteFavoriteMovie(id).subscribe(() => {
      this.snackbar.open(
        `${title} has been removed from your Favorites`,
        'OK',
        {
          duration: 2000,
        }
      );
      setTimeout(function () {
        window.location.reload();
      }, 1000);
    });
  }

  /**
   * function to display profile update dialog
   */
  profileUpdateDialog(): void {
    this.dialog.open(ProfileUpdateComponent, {
      width: '280px',
    });
  }

}

