import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LogsService } from '../logs/logs.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  formData!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('loggedIn'))
      this.router.navigate(['/']);

    this.formData = new FormGroup({
      username: new FormControl('admin'),
      password: new FormControl('admin')
    });
  }

  onSubmit(data: any) {
    this.username = data.username;
    this.password = data.password;

    this.authService.login(this.username, this.password)
      .then(data => {
        console.log("Is Login Success: " + data);

        this.router.navigate(['/']);
      })
      .catch(err => console.log(err));
  }
}
