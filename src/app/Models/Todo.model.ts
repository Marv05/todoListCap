import { Category } from './Category.model';

export interface Todo {
    title: string;
    done: boolean;
    category: Category;
    createdAt: number;
    alarmDate: any;
  }