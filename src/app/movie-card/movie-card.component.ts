import { Component, OnInit } from '@angular/core';
import { GetAllMoviesService, AddFavoriteMovieService } from '../fetch-api-data.service';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: GetAllMoviesService,
    public fetchApiData2: AddFavoriteMovieService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    ) { }

  /**
   * getMovies() function is run on init
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * retrieves a list of all the movies and stores them in an array
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
  }

  /**
   * 
   * Opens dialog with director info
   * @param name 
   * @param bio 
   * @param birthday 
   */
  showDirectorDialog(
    name: string,
    bio: string,
    birth: Date,
    death: Date
  ): void {
    this.dialog.open(DirectorViewComponent, {
      data: { name, bio, birth, death },
      width: '350px',
    });
  }

  /**
   * Opens dialog with movie genre info
   * 
   * @param name 
   * @param description 
   */
  showGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: { name, description },
      width: '350px',
    });
  }

  /**
   * Opens dialog box with movie summary info
   * 
   * @param title 
   * @param imagepath 
   * @param description 
   * @param director 
   * @param genre 
   */
  showDetailsDialog(
    title: string,
    imagepath: string,
    description: string,
    director: string,
    genre: string
  ): void {
    this.dialog.open(MovieDetailsComponent, {
      data: { title, imagepath, description, director, genre },
      width: '350px',
    });
  }

  /**
   * Adds movie to favorite list
   * 
   * @param id 
   * @param title 
   */
  addFavorite(id: string, title: string): void {
    this.fetchApiData2.addFavoriteMovie(id).subscribe(() => {
      this.snackBar.open(`${title} has been added to your favorites!`, 'OK', {
        duration: 2000,
      });
    });
  }

}
