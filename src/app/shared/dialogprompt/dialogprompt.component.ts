import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogprompt',
  templateUrl: './dialogprompt.component.html',
  styleUrls: ['./dialogprompt.component.scss']
})
export class DialogpromptComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogpromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
