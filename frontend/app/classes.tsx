import moment from 'moment';

export class Meal {
  id: any;
  title: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  constructor(id, title: string, calories: number, carbs: number, protein: number, fat: number) {
    this.id = id;
    this.title = title; // string
    this.calories = calories; // integer
    this.carbs = carbs; // integer
    this.protein = protein; // integer
    this.fat = fat; // integer
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      calories: this.calories,
      carbs: this.carbs,
      protein: this.protein,
      fat: this.fat,
    };
  }

  static fromJSON(json) {
    return new Meal(json.id, json.title, json.calories, json.carbs, json.protein, json.fat);
  }
}

export class Day {
  date: moment.Moment;
  meals: Meal[];
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  constructor(date: moment.Moment, meals = []) {
    this.date = date; // Date object
    this.meals = meals.map((meal, index) => new Meal(index + 1, meal.title, meal.calories, meal.carbs, meal.protein, meal.fat)); // array of Meal objects
    this.calories = 0; // integer
    this.carbs = 0; // integer
    this.protein = 0; // integer
    this.fat = 0; // integer

    // Calculate totals when meals are provided
    this.calculateTotals();
  }

  calculateTotals() {
    this.calories = this.meals.reduce((sum, meal) => sum + meal.calories, 0);
    this.carbs = this.meals.reduce((sum, meal) => sum + meal.carbs, 0);
    this.protein = this.meals.reduce((sum, meal) => sum + meal.protein, 0);
    this.fat = this.meals.reduce((sum, meal) => sum + meal.fat, 0);
  }

  addMeal(meal: Meal) {
    this.meals.push(meal);
    this.calculateTotals();
  }
  toJSON() {
    return {
      date: this.date.toISOString(),
      meals: this.meals.map(meal => meal.toJSON()),
      calories: this.calories,
      carbs: this.carbs,
      protein: this.protein,
      fat: this.fat,
    };
  }

  static fromJSON(json) {
    const date = moment(json.date);
    const meals = json.meals.map(Meal.fromJSON);
    return new Day(date, meals);
  }
}