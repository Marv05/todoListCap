import { Component } from '@angular/core';
import { CategoriesService } from '../categories.service';
import { Category } from '../Models/Category.model';
import { Todo } from '../Models/Todo.model';
import { TodosService } from '../todos.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  //user interactions
  clickedAdd = false;
  clickedEdit = false;
  selectedCat:string = null  //categroy bean eher vllt
  selectedColour:string = null; //oder enum?
  selectedSearchCat:string = null; 
  sortOption:any = null;
  inputText = '';
  itemToEdit: Todo = null; //is still needed?
  itemToEditIndex: number = -1;
  searchTerm:string = null;

  //todos
  todos: Todo[];
  todosDisplayed: Todo[];
 
  //selectables
  categories:Category[];
  sortOptions = ['abc...', 'zyx...', 'newest', 'oldest'];
 

  constructor(private todosService:TodosService,private categoriesService:CategoriesService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.refreshTodos(); 
    this.refreshCategories();
    console.log('NGONINIT');
  }

  //zum refresehen nach dem categories potentiell geändert wurden
  ionViewWillEnter(){
    this.refreshTodos(); 
    this.refreshCategories();
    console.log('ionviewwillenter');
  }

  refreshTodos(){
    this.todosService.getTodos().then((todos: Todo[]) => {
      if(todos){
        this.todos = [...todos];
        this.todosDisplayed = [...todos];
        this.search();  //filter beibehalten
        this.onChangeSort();  //sortierung beibehalten
      }else{
        this.todos = [];
      }
    });
  }

  refreshCategories(){
    this.categoriesService.getCategories().then((categories: Category[]) => {
      if(categories){
        this.categories = [...categories];
      }else{
        this.categories = [];
      }
      console.log(this.categories);
    });
  }

  checked(index:number){
    console.log('checked');
    console.log(index);

    //änderungen in DB persistieren
    this.todosService.updateTodoDone(index);
  }
  
  selectedCategory(){
    console.log('SELECTEDCATEGORY');
  }

  search(){
    this.todosDisplayed = [...this.todos];
    if(!(this.searchTerm === null || this.searchTerm ==="")){
      this.todosDisplayed = this.todosDisplayed.filter(todo => 
        todo.title.includes(this.searchTerm)
      );
    }
    if(this.selectedSearchCat){
      this.todosDisplayed = this.todosDisplayed.filter( todo => 
        todo.category.title === this.selectedSearchCat
      );
    }
    this.onChangeSort();
  }

  onChangeSort(){
    switch (this.sortOption) {
      case 'abc...':
        this.sortABC();
        break;
      case 'zyx...':
        this.sortZYX();
        break;
      case 'newest':
        this.sortNewest();
        break;
      case 'oldest':
        this.sortOldest();
        break;
      default:
        console.log(this.todosDisplayed);
        break;
    }
  }

  //helperfunction
  sortABC(){
    this.todosDisplayed.sort((a, b) => {
      let titleA=a.title.toLowerCase(), titleB=b.title.toLowerCase();
      if (titleA < titleB) //sort string ascending
          return -1; 
      if (titleA > titleB)
          return 1;
      return 0; //default return value (no sorting)
    });
  }

  //helperfunction
  sortZYX(){
    this.todosDisplayed.sort((a, b) => {
      let titleA=a.title.toLowerCase(), titleB=b.title.toLowerCase();
      if (titleA < titleB) //sort string descending
          return 1; 
      if (titleA > titleB)
          return -1;
      return 0; //default return value (no sorting)
    });
  }

  //helperfunction
  sortNewest(){
    this.todosDisplayed.sort((a, b) => {
      let dateA=a.createdAt, dateB=b.createdAt;
      if (dateA < dateB) //sort string 
          return 1; 
      if (dateA > dateB)
          return -1;
      return 0; //default return value (no sorting)
    });
  }

  //helperfunction
  sortOldest(){
    this.todosDisplayed.sort((a, b) => {
      let dateA=a.createdAt, dateB=b.createdAt;
      if (dateA < dateB) //sort string 
          return -1; 
      if (dateA > dateB)
          return 1;
      return 0; //default return value (no sorting)
    });
  }

  clearFilters(){
    this.sortOption = null
    this.selectedSearchCat = null;
    this.refreshTodos();
  }

  clearCatAndAlarm(){
    console.log('CLEAR');
    this.selectedCat = null;
  }

  add() {
    console.log('SELECTED CAT');
    console.log(this.selectedCat);
    console.log(this.todosService.storeTodo(this.inputText, this.selectedCat).then(() => {
      this.refreshTodos();  //refresh after store
      this.inputText = ''; //reset
      this.selectedCat = '';
      this.hideInput();
    }));
    
  }

  edit(){
    if(this.itemToEditIndex != -1){
      this.todosService.updateTodo(this.inputText, this.selectedCat, this.itemToEditIndex).then(() => {
        this.refreshTodos();  //refresh after edit
        //reset
        this.inputText = ''; 
        this.itemToEdit = null;
        this.itemToEditIndex = -1;
        this.hideInput();
      });
    }
  }

  showInputAdd(){
    this.inputText = "";
    this.clickedAdd = true;
  }

  showInputEdit(todo:Todo, i:number){
    this.inputText = todo.title;
    this.clickedEdit = true;
    this.itemToEdit = todo;
    this.itemToEditIndex = i;
    //daten übertragen
    this.selectedCat = todo.category.title;
  }

  hideInput(){
    this.clickedAdd = false;
    this.clickedEdit = false;
  }

  delete(i: any){
    this.todosService.deleteTodo(i).then(()=>{
      this.refreshTodos();  //refresh after delete
    });
  }

  alarm(){
    console.log('ALARM 1');
  }
  
  alarm2(){
    console.log('ALARM 2');
  }

  chooseCategory(){
    console.log('CHOOSE_CAT');
  }

}
