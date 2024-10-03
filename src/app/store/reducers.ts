import { createReducer, on } from '@ngrx/store';
import { loadProducts, loadProductsSuccess, loadProductsFailure, setFilter } from './actions';
import { Product } from '../models/models';

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  error: any;
  filter: string;
}

export const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  error: null,
  filter: ''
};

export const productReducer = createReducer(
  initialState,
  on(loadProducts, state => ({ ...state })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    filteredProducts: products // Inicialmente, los productos filtrados son todos los productos
  })),
  on(loadProductsFailure, (state, { error }) => ({ ...state, error })),
  on(setFilter, (state, { filter }) => {
    const filteredProducts = state.products.filter(product =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
    return { ...state, filter, filteredProducts };
  })
);
