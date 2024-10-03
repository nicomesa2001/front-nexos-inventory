import { createAction, props } from '@ngrx/store';
import { Product } from '../models/models';

export const loadProducts = createAction('[Product List] Load Products');
export const loadProductsSuccess = createAction(
  '[Product List] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product List] Load Products Failure',
  props<{ error: any }>()
);
export const setFilter = createAction(
  '[Product List] Set Filter',
  props<{ filter: string }>()
);
export const deleteProduct = createAction(
  '[Product List] Delete Product',
  props<{ id: number, userId: number }>()
);
export const updateProduct = createAction(
  '[Product List] Update Product',
  props<{ id: number; product: Omit<Product, 'id'> }>()
);
