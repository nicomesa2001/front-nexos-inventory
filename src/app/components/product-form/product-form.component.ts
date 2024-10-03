import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { Product, User } from 'src/app/models/models';
import { AlertifyService } from 'src/app/service/alertify.service';

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
    private router: Router,
    private alertify: AlertifyService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      dateOfEntry: ['', Validators.required],
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
      (error: any) => console.error('Error al cargar usuarios: ', error.error.message)
    );
  }

  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe(
      (product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          quantity: product.quantity,
          dateOfEntry: product.dateOfEntry,
          userId: product.user.id
        });
      },
      (error: any) => this.alertify.error('Error al cargar el producto ' + error.error.message)
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
          () => {
            this.alertify.success('Producto actualizado con éxito');
            this.router.navigate(['/products']);
          },
          (error: any) => {
            this.alertify.error('Error al actualizar el producto ' + error.error.message);
          }
        );
      } else {
        this.productService.addProduct(productData).subscribe(
          () => {
            this.router.navigate(['/products']);
            this.alertify.success('Producto añadido con éxito');
          },
          (error: any) => {
            this.alertify.error('Error al añadir el producto ' + error.error.message);
          }
        );
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
