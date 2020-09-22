import { Injectable } from '@angular/core';
import { Category } from './Models/Category.model';
import { Storage } from '@ionic/storage';
import { TodosService } from './todos.service';
import { Todo } from './Models/Todo.model';

const CATEGORIES_KEY = 'my-categories';
const TODOS_KEY = 'my-todos';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private storage: Storage) { }


  getCategories(): Promise<Category[]> {  //oder <any>?
    return this.storage.get(CATEGORIES_KEY);
  }

  getCategory(title:string): Promise<Category[]> {  //oder <any>?
    return this.storage.get(CATEGORIES_KEY).then((categories: Category[])=>{
      console.log('get Category');
      console.log(categories);
      return categories.filter(c => c.title === title);
    });
  }

  //selected category übergeben...
  storeCategory(title:string, colour:string):Promise<any>{  //wenn Storage genutzt wird, wird hier promise returnt
    //farbe muss noch ergänzt und übergeben werden, done/todos müssen über funktione ermittelt werden!?
    let tmp: Category = {title:title, done: null, todos: null, colour: colour};
    return this.storage.get(CATEGORIES_KEY).then((categories: Category[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(categories){  
        console.log('UNSHIFT' + categories);
        categories.unshift(tmp);
        return this.storage.set(CATEGORIES_KEY, categories);
      } else {
        console.log('ELSE');
        return this.storage.set(CATEGORIES_KEY, [tmp]);
      }
    });
  }

  updateCategory(title:string, colour:string, index:number):Promise<any>{
    //farbe muss noch ergänzt und übergeben werden, done/todos müssen über funktione ermittelt werden!?
    return this.storage.get(CATEGORIES_KEY).then((categories: Category[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(!categories || categories.length === 0 || index >= categories.length  || index < 0){  
        return null;
      }else {
        let old = categories[index];
        let tmp: Category = {title: title, done: null, todos: null, colour: colour
        };
        categories.splice(index, 1, tmp);  //1 element soll gelöscht werden und 1 hinzugefügt werden
        return this.storage.set(CATEGORIES_KEY, categories);
      }
    });
  }

  deleteCategory(index:number){  //index!?
    //this.todos.splice(i, 1);
    return this.storage.get(CATEGORIES_KEY).then((categories: Category[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(!categories || categories.length === 0 || index >= categories.length  || index < 0){  
        return null;
      }else {
        this.resetCategoryOfTodos(categories[index]);
        categories.splice(index, 1);  //1 element soll gelöscht werden und 1 hinzugefügt werden
        return this.storage.set(CATEGORIES_KEY, categories);
      }
    });
  }

  resetCategoryOfTodos(category:Category){
    return this.storage.get(TODOS_KEY).then((todos: Todo[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(todos){  
        console.log(todos);
        for(var i = 0; i < todos.length; i++) {
          if (todos[i].category.title === category.title) {
            let tmp: Category = {title:'', done: null, todos: null, colour: 'default-colour'}; //keine schöne lösung
            todos[i].category = tmp;
          }
        }
        console.log(todos);
        return this.storage.set(TODOS_KEY, todos);
      } else {
        console.log('No Todos in this category...');
      }
    });
  }

}