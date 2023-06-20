import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { switchMap, tap, filter } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit{

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'}
  ]

  public heroForm = new FormGroup({

    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });


  constructor (

    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {

    // Como edit y new Hero comparten la misma pagina tenemos que verificar
    // la url de la que viene ya que en:
    // new hero => heroes/new-hero
    // edit hero => edit/:id

    if ( !this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById(id) )
      )
      .subscribe( hero => {

        // Cualquiera de las dos optiones vale
        // if ( !hero ) return this.router.navigate(['/heroes/list']);
        if ( !hero ) return this.router.navigateByUrl('/');


        // usamos reset() para rellenar el valor de los inputs
        this.heroForm.reset( hero );

        return ;
      })
  }


  // Metodo para asignar a una constante el valor del FormControl
  get currentHero(): Hero {

    const hero = this.heroForm.value as Hero;

    return hero;
  }


  onSubmit(): void {

    // console.log({
    //   formIsValid: this.heroForm.valid,
    //   value: this.heroForm.value
    // });

    if ( this.heroForm.invalid) return;

    // this.heroesService.upDateHero( this.heroForm.value ); NO SE HACE ASÍ

    if ( this.currentHero.id ){

      this.heroesService.upDateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero} updated!`);
        });

        return;
    }

    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(`${ hero.superhero} created!`);
      })
  }


  // Aqui creo el metodo para la ventana emergente a la hora de borrar un elemento (dialog)
  onDeleteHero() {

    if ( !this.currentHero.id ) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });


    dialogRef.afterClosed()
      .pipe(
        // filter( result => result === true),
        filter( (result: boolean) => result ),
        // tap( result => console.log('valor result tap', result) )
        switchMap( () => this.heroesService.deleteHeroById( this.currentHero.id )),
        filter( (wasDeleted: boolean) => wasDeleted )
      )
      .subscribe( () => {

          this.router.navigate(['/heroes'])
      })

    // aqui recogemos el valor booleano que nos han enviado de pulsar a los botones del dialog
    // dialogRef.afterClosed()
    //   .subscribe(result => {

    //     if( !result) return;

    //     this.heroesService.deleteHeroById( this.currentHero.id )
    //       .subscribe( wasDeleted => {

    //         if( wasDeleted ) {

    //         this.router.navigate(['/heroes'])
    //         }
    //       })
    //   });
  }



  showSnackbar( message: string ):void {

    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }

}
