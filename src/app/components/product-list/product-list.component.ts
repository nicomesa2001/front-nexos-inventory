import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/models';
import { AlertifyService } from 'src/app/service/alertify.service';
import { loadProducts, setFilter, deleteProduct as deleteProductAction } from 'src/app/store/actions';
import { ProductState } from 'src/app/store/reducers';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  filter: string = '';

  constructor(private store: Store<{ products: ProductState }>, public router: Router, private alertify: AlertifyService) {
    this.products$ = this.store.select(state => state.products.filteredProducts);
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  onSearch(): void {
    this.store.dispatch(setFilter({ filter: this.filter }));
  }

  editProduct(productId: number): void {
    this.router.navigate(['/products/edit', productId]);
  }

  deleteProduct(productId: number): void {
    const userId = 1
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.store.dispatch(deleteProductAction({ id: productId, userId }));
      this.alertify.success('Producto eliminado con éxito');
      this.store.dispatch(loadProducts());
    }
  }
}
