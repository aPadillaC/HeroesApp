import { Component } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})
export class SearchPageComponent {

  constructor( private heroesService: HeroesService ) {}

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;


  searchHero() {

    const value: string = this.searchInput.value || "";

    this.heroesService.getSuggestions( value )
      .subscribe( heroes => this.heroes = heroes );
  }


  onSelectedOption( event: MatAutocompleteSelectedEvent): void {

    // el valor de la option seleccionada se saca de la ruta del event => event.option.value
    // optionSelected es un evento propio del autoComplete de Angular Material

    if( !event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    // para darle el valor al input según la option que hayamos seleccionado
    this.searchInput.setValue( hero.superhero );

    this.selectedHero = hero;

  }


}
