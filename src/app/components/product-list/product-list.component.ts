import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, public router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => this.products = data,
      (error: any) => console.error('Error fetching products:', error)
    );
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      // Aquí deberías obtener el ID del usuario actual
      const currentUserId = 1; // Esto es un ejemplo, debes implementar la lógica para obtener el ID del usuario actual
      this.productService.deleteProduct(id, currentUserId).subscribe(
        () => {
          this.loadProducts();
        },
        (error: any) => console.error('Error deleting product:', error)
      );
    }
  }
}
