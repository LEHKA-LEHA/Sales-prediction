import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  selectedFile: File | null = null;
  uploadStatus: string = '';

  uploadedFile: File | null = null;
  selectedPredictionLevel: string = 'daily';
  predictionFromDate: string | null = null;
  predictionToDate: string | null = null;

  constructor(private afAuth: AngularFireAuth, private router: Router, private http: HttpClient) { }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.selectedFile = file;
      this.uploadStatus = 'File selected: ' + this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.uploadStatus = 'Please select a CSV file.';
    }
  }

  viewUploadedFile() {
    if (this.selectedFile) {
      const fileURL = URL.createObjectURL(this.selectedFile);
      window.open(fileURL, '_blank');
    }
  }

  submitForm() {
    if (this.selectedFile) {
      let FileData: FormData = new FormData();
      FileData.append('file', this.selectedFile, this.selectedFile.name);
      this.http.post('http://127.0.0.1:5000/input', FileData, { responseType: 'text' }).subscribe(response => {
        alert(response);
      });
    }
  }
}
