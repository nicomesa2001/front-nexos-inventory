import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { RoleService } from 'src/app/service/role.service';
import { User, Role } from 'src/app/models/models';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  isEditMode = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private route: ActivatedRoute,
    private router: Router,
    private alertify: AlertifyService,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      roleId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser(this.userId);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(
      (data: Role[]) => this.roles = data,
      (error: any) => console.error('Error cargando roles: ', error.error.message)
    );
  }

  loadUser(id: number): void {
    this.userService.getUserById(id).subscribe(
      (user: User) => {
        this.userForm.patchValue({
          name: user.name,
          age: user.age,
          roleId: user.role.id
        });
      },
      (error: any) => console.error('Error cargando usuarios: ', error.error.message)
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: Omit<User, 'id'> = {
        ...this.userForm.value,
        role: { id: this.userForm.value.roleId }
      };
      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe(
          () => {
            this.router.navigate(['/users']);
            this.alertify.success('Usuario actualizado con éxito');
          },
          (error: any) => {
            this.alertify.error('Error al actualizar el producto ' + error.error.message);
          }
        );
      } else {
        this.userService.addUser(userData).subscribe(
          () => this.router.navigate(['/users']),
          (error: any) => {
            this.alertify.error('Error al añadir el usuario ' + error.error.message);
          }
        );
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
