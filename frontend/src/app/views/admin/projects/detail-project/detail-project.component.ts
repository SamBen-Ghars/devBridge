import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetService } from '@app/services/projets.service';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-detail-project',
  templateUrl: './detail-project.component.html',
  styleUrls: ['./detail-project.component.css']
})
export class DetailProjectComponent implements OnInit {
  projet: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjetService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProjetById(id).subscribe((data) => {
        this.projet = data;
      });
    }
  }

  getFileUrl(filePath: string): string {
    return this.fileService.getDownloadUrl(filePath);
  }

  deleteProjet(id: string | undefined): void {
    if (!id) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProjet(id).subscribe({
        next: () => {
          alert('Projet supprimé avec succès');
          this.router.navigate(['/admin/projects']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du projet', err);
          alert('Erreur lors de la suppression du projet');
        }
      });
    }
  }
}







