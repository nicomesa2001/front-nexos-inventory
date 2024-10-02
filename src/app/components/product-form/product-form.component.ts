import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { Product, User } from 'src/app/models/models';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  users: User[] = [];
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      entryDate: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => this.users = data,
      (error: any) => console.error('Error fetching users:', error)
    );
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          quantity: product.quantity,
          entryDate: product.entryDate,
          userId: product.user.id
        });
      },
      (error: any) => console.error('Error fetching product:', error)
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData: Omit<Product, 'id'> = {
        ...this.productForm.value,
        user: { id: this.productForm.value.userId }
      };
      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(this.productId, productData).subscribe(
          () => this.router.navigate(['/products']),
          (error: any) => console.error('Error updating product:', error)
        );
      } else {
        this.productService.addProduct(productData).subscribe(
          () => this.router.navigate(['/products']),
          (error: any) => console.error('Error adding product:', error)
        );
      }
    }
  }
}
