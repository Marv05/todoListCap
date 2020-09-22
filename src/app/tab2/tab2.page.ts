import { Component } from '@angular/core';
import { CategoriesService } from '../categories.service';

import { Category } from '../Models/Category.model';
import { TodosService } from '../todos.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  clickedAdd:boolean = false;
  clickedEdit:boolean = false;
  inputText:string = '';
  inputColour:string = 'default-colour'; // ''
  itemToEditIndex: number = -1;

  //Service einführen!?
  // -> Soll kategorien persistieren und beiden seiten zur verfügung stellen
  categories:Category[] = [{title:'Exercises', done: -1, todos: -1, colour: 'red'}, {title:'Work', done: -1, todos: -1, colour: 'blue'}];

  constructor(private categoriesService:CategoriesService, private todosService: TodosService) {}

  ngOnInit(): void{
    this.refreshCategories();
  }

  //zum refresehen nach dem categories potentiell geändert wurden
  ionViewWillEnter(){
    console.log('ionviewwillenter P2');
    //count todos in all categories
    this.countForEachCategory();
  }

  countForEachCategory(){
    this.categoriesService.getCategories().then(async (categories) => {
      for(var i = 0; i < categories.length; i++) {
         await this.countTodosOfCategory(categories[i].title).then((count)=>{
            this.categories[i].todos = count;
         });
         await this.todosService.getAllTodosOfCategory(categories[i].title).then((todos)=>{
          this.categories[i].done = this.todosService.countDones(todos);
         });
      }
    });
  }

  
  //will später anzeigen, wieviele TODOs zu dieser Kategorie gehören
  //und wieviele davon abgehakt worden sind
  countTodosOfCategory(category:string):Promise<number>{
    return this.todosService.getAllTodosOfCategory(category).then((todos) => {
      return todos.length;
    });
  }

  async refreshCategories(){
    await this.categoriesService.getCategories().then((categories: Category[]) => {
      if(categories){
        this.categories = [...categories];
      }else{
        this.categories = [];
      }
    });
    this.countForEachCategory();
  }

  showInputAdd(){
    this.clickedAdd = true;
  }

  showInputEdit(category:Category, i:number){
    this.clickedEdit = true;
    this.inputText = category.title;
    this.itemToEditIndex = i;
    //colour übertragen
  }

  add(){
    if(this.inputText){
      console.log('Categories Available?');
      console.log(this.categoryAvailable(this.inputText));
      if(this.categoryAvailable(this.inputText)){
        console.log('category available');
        this.categoriesService.storeCategory(this.inputText, 'default-colour').then(()=>{
          this.refreshCategories();
          this.hideInput();
          this.inputText = '';
        })
      }else{
        console.log('Alert: category already exists!');
      }
    }else{
      //Alert: provide title!
      console.log('No empty title allowed!');
    }
  }

  edit(){
    if(this.itemToEditIndex != -1){
      this.categoriesService.updateCategory(this.inputText, this.inputColour, this.itemToEditIndex).then(() => {
        this.refreshCategories();  //refresh after edit
        //reset
        this.inputText = '';
        this.inputColour = 'default-colour'; // ''
        this.itemToEditIndex = -1;
        this.hideInput();
      });
    }
  }

  hideInput(){
    this.clickedAdd = false;
    this.clickedEdit = false;
  }

  categoryAvailable(category:string){
    let available = true;
    this.categories.forEach(element => {
      if(element.title === category){
        available = false;
      }
    });
    return available;
  }

  delete(index:number){
    //TODOs mit dieser Category updaten -> auf Categroy null setzen!!!
    //this.todosService.resetCategory()
    this.categoriesService.deleteCategory(index).then(()=>{
      this.refreshCategories();  //refresh after delete
    });
  }




}
