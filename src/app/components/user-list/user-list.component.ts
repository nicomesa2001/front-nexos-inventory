import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/models';
import { AlertifyService } from 'src/app/service/alertify.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, public router: Router, private alertifyService: AlertifyService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => this.users = data,
      (error: any) => this.alertifyService.error('Error al cargar los usuarios ' + error.error.message)
    );
  }

  editUser(id: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          this.alertifyService.success('Usuario eliminado con éxito');
          this.loadUsers();
        },
        (error: any) => this.alertifyService.error('Error al eliminar el usuario ' + error.error.message)
      );
    }
  }
}
