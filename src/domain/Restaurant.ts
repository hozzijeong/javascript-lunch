import { Category, DistanceTime } from '../types/type';

export interface IRestaurant {
  category: Category;
  distance: DistanceTime;
  name: string;
  description?: string;
  URLlink?: string;
}

export class Restaurant {
  #state: IRestaurant = {
    category: '한식',
    distance: 5,
    name: '',
  };

  constructor(restaurant: IRestaurant) {
    this.#state = { ...restaurant };
  }

  getRestaurantInfo() {
    return { ...this.#state };
  }
}
