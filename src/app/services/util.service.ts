import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  openSnackBar(configs: any) {
    console.log('configs: ', configs);
    this._snackBar.open(configs.text, configs.btnLabel ? configs.btnLabel : '', {
      duration: configs.duration ? configs.duration : 1500,
      horizontalPosition: configs.horizontalPosition ? configs.horizontalPosition : "right",
      verticalPosition: configs.verticalPosition ? configs.verticalPosition : "top",
      panelClass: configs.panelClass ? configs.panelClass : "custom-toaster",
    });
  }
}
