import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '../../../../services/projets.service';
import { RendusService } from '../../../../services/rendus.service';
import { AuthuserService } from '../../../../services/authuser.service';

@Component({
  selector: 'app-project-submission',
  templateUrl: './project-submission.component.html',
  styleUrls: ['./project-submission.component.css']
})
export class ProjectSubmissionComponent implements OnInit {
  projetId: string = '';
  projet: any;
  submissionForm: FormGroup;
  selectedFiles: File[] = [];
  isLoading = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService,
    private rendusService: RendusService,
    private authService: AuthuserService
  ) {
    this.submissionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.projetId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProjetDetails();
  }

  loadProjetDetails(): void {
    this.isLoading = true;
    this.projetService.getProjetById(this.projetId).subscribe({
      next: (projet) => {
        this.projet = projet;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du projet', err);
        this.isLoading = false;
        this.router.navigate(['/front/projects']);
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit(): void {
    if (this.submissionForm.invalid || this.selectedFiles.length === 0) {
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    formData.append('projet', this.projetId);
    formData.append('etudiant', this.authService.getCurrentUserId() || '');
    formData.append('description', this.submissionForm.value.description);
    
    this.selectedFiles.forEach(file => {
      formData.append('fichiers', file);
    });

    this.rendusService.submitRendu(formData).subscribe({
      next: (response) => {
        alert('Votre projet a été soumis avec succès');
        this.router.navigate(['/front/projects']);
      },
      error: (err) => {
        console.error('Erreur lors de la soumission du projet', err);
        alert('Une erreur est survenue lors de la soumission du projet');
        this.isSubmitting = false;
      }
    });
  }
}



