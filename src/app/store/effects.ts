import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadProducts, loadProductsSuccess, loadProductsFailure, deleteProduct, updateProduct } from './actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductService } from '../service/product.service';
import { AlertifyService } from '../service/alertify.service';

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private alertify: AlertifyService
  ) { }

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      mergeMap(() =>
        this.productService.getProducts().pipe(
          map(products => loadProductsSuccess({ products })),
          catchError(error => {
            this.alertify.error('Error al cargar los productos: ' + error.error.message); // Mensaje de error
            return of(loadProductsFailure({ error }));
          })
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteProduct),
      mergeMap(action =>
        this.productService.deleteProduct(action.id, action.userId).pipe(
          map(() => {
            this.alertify.success('Producto eliminado con éxito');
            return loadProducts();
          }),
          catchError(error => {
            this.alertify.error('Error al eliminar el producto: ' + error.error.message);
            return of(loadProductsFailure({ error }));
          })
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateProduct),
      mergeMap(action =>
        this.productService.updateProduct(action.id, action.product).pipe(
          map(() => {
            this.alertify.success('Producto actualizado con éxito');
            return loadProducts();
          }),
          catchError(error => {
            this.alertify.error('Error al actualizar el producto: ' + error.error.message);
            return of(loadProductsFailure({ error }));
          })
        )
      )
    )
  );
}
