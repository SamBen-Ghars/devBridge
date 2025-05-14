import { Component, OnInit } from '@angular/core';
import { ProjetService } from '@app/services/projets.service';
import { Projet } from '@app/models/projet.model';
import { AuthuserService } from '@app/services/authuser.service';
import { RendusService } from '@app/services/rendus.service';
import { FileService } from '../../../../services/file.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projets: Projet[] = [];
  rendusMap: Map<string, boolean> = new Map();
  isLoading = true;
  userGroup: string = '';

  constructor(
    private projetService: ProjetService,
    private authService: AuthuserService,
    private rendusService: RendusService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    // On garde cette ligne pour une utilisation future
    this.userGroup = this.authService.getCurrentUser()?.groupe || '';
    this.loadProjets();
  }

  loadProjets(): void {
    this.isLoading = true;
    this.projetService.getProjets().subscribe({
      next: (projets) => {
        // Afficher tous les projets sans filtrage
        this.projets = projets;
        this.isLoading = false;
        
        // Vérifier quels projets ont déjà été rendus par l'étudiant
        this.projets.forEach(projet => {
          if (projet._id) {
            this.checkRenduStatus(projet._id);
          }
        });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des projets', error);
        this.isLoading = false;
      }
    });
  }

  checkRenduStatus(projetId: string): void {
    const etudiantId = this.authService.getCurrentUserId();
    if (!etudiantId) return;
    
    this.rendusService.checkRenduExists(projetId, etudiantId).subscribe({
      next: (exists: boolean) => {
        this.rendusMap.set(projetId, exists);
      },
      error: (error: any) => {
        console.error(`Erreur lors de la vérification du rendu pour le projet ${projetId}`, error);
      }
    });
  }

  getFileUrl(filePath: string): string {
    // Méthode simple sans dépendre du service
    return `http://localhost:3000/${filePath}`;
  }
  
  // Méthode pour vérifier si un projet a été rendu
  isRendu(projetId: string | undefined): boolean {
    return projetId ? this.rendusMap.get(projetId) === true : false;
  }
}










