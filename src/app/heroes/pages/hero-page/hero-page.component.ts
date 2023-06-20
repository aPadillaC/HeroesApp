import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit{

  constructor (

    private activatedRoute: ActivatedRoute,
    private heroesService: HeroesService,
    private router: Router
  ) {}

  public hero?: Hero


  ngOnInit(): void {

    // Con activatedRoute capturo el valor de los params
    this.activatedRoute.params
      .pipe(
        delay(250), // demora 3 segundos la petición
        switchMap( ({ id }) => this.heroesService.getHeroById(id) ) // lo utilizamos para realizar la captura por destructuring del valor id de los params y obtenemos el valor del Hero o undefined tal y como definimos en el service
      )
      .subscribe( hero => {

        if ( !hero ) return this.router.navigate(['/heroes/list']);

        this.hero = hero;
        console.log({hero});


        return ;
      })
  }



  goBack(): void {

    this.router.navigateByUrl('/heroes/list');
  }

}
