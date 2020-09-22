import { Injectable } from '@angular/core';
import { Todo } from './Models/Todo.model';

import { Storage } from '@ionic/storage';
import { Category } from './Models/Category.model';
import { CategoriesService } from './categories.service';

const TODOS_KEY = 'my-todos';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private storage: Storage, private categoriesService:CategoriesService) {
  }

  getTodos(): Promise<Todo[]> {  //oder <any>?
    return this.storage.get(TODOS_KEY);
  }

  countDones(todos:Todo[]){
    let count: number = 0;
    for(var i = 0; i < todos.length; i++) {
      console.log('CountDones');
      console.log(todos[i]);
      if (todos[i].done === true) {
        count++;
      }
    }
    return count;
  }

  //selected category übergeben...
  async storeTodo(title:string, selectedCat:string):Promise<any>{  //wenn Storage genutzt wird, wird hier promise returnt
    console.log('STORE TODO');
    let tmpCat: Category;
    let tmpTodo: Todo;
    if(selectedCat !== ''){
      this.categoriesService.getCategory(selectedCat).then((categories) => {
        console.log('CATEGORIES');
        console.log(categories);
        if(categories.length > 0){
          tmpCat = categories[0];
        }else{
          console.log('no categories found');
        }

        tmpTodo= {title: title, done: false, category: tmpCat, createdAt:Date.now(), alarmDate:null};
        console.log(tmpCat);
        
      });
      
    }else{
      tmpCat = {title:selectedCat, done: null, todos: null, colour: null};
    }
    
    //farbe muss noch ergänzt und übergeben werden, done/todos müssen über funktione ermittelt werden!?
    //vllt maximal 300 todos zulassen? if length >= 300 ... abbbrechen
    return this.storage.get(TODOS_KEY).then((todos: Todo[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(todos){  
        console.log('UNSHIFT' + todos);
        todos.unshift(tmpTodo);
        return this.storage.set(TODOS_KEY, todos);
      } else {
        console.log('ELSE');
        return this.storage.set(TODOS_KEY, [tmpTodo]);
      }
    });

  }

  updateTodo(title:string, selectedCat:string, index:number):Promise<any>{
    //farbe muss noch ergänzt und übergeben werden, done/todos müssen über funktione ermittelt werden!?
    let tmpCat: Category = {title:selectedCat, done: null, todos: null, colour: null};
    let tmp :Todo = {title: title, done: false, category: tmpCat, createdAt:null, alarmDate:null};
    return this.storage.get(TODOS_KEY).then((todos: Todo[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(!todos || todos.length === 0 || index >= todos.length  || index < 0){  
        return null;
      }else {
        let old = todos[index];
        tmp.createdAt = old.createdAt;  //created at vom zu editierenden übernehmen und dem 'neuen geben'
        todos.splice(index, 1, tmp);  //1 element soll gelöscht werden und 1 hinzugefügt werden
        return this.storage.set(TODOS_KEY, todos);
      }
    });
  }

  updateTodoDone(index:number):Promise<any>{
    
    return this.storage.get(TODOS_KEY).then((todos: Todo[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(!todos || todos.length === 0 || index >= todos.length  || index < 0){  
        return null;
      }else {
        let old = todos[index];
        let tmp:Todo = {
          createdAt: old.createdAt,
          alarmDate: old.alarmDate,
          category: old.category,
          title: old.title,
          done: !(old.done)
        };
        todos.splice(index, 1, tmp);  //1 element soll gelöscht werden und 1 hinzugefügt werden
        return this.storage.set(TODOS_KEY, todos);
      }
    });
  }

  deleteTodo(index:number){  //index!?
    //this.todos.splice(i, 1);
    return this.storage.get(TODOS_KEY).then((todos: Todo[]) => {
      //check if there is already an array with entries - if not store the first entry as an array
      if(!todos || todos.length === 0 || index >= todos.length  || index < 0){  
        return null;
      }else {
        todos.splice(index, 1);  //1 element soll gelöscht werden und 1 hinzugefügt werden
        return this.storage.set(TODOS_KEY, todos);
      }
    });
  }



  //Testen!
  getAllTodosOfCategory(category:string){
    return this.storage.get(TODOS_KEY).then((todos: Todo[]) => {
      let todosOfCategory: Todo[] = [];
      //check if there is already an array with entries - if not store the first entry as an array
      if(todos){  
        for(var i = 0; i < todos.length; i++) {
          if (todos[i].category.title === category) {
            todosOfCategory.push(todos[i]);
          }
        }
        console.log('todosOfCategory');
        console.log(todosOfCategory);
        
      } else {
        console.log('No Todos in this category...');
      }
      return todosOfCategory;
    });
  }

}
