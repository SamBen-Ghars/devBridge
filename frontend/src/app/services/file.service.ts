import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  
  constructor() { }
  
  /**
   * Génère une URL de téléchargement pour un fichier
   * @param filePath Chemin du fichier
   * @returns URL de téléchargement
   */
  getDownloadUrl(filePath: string): string {
    // Extraire uniquement le nom du fichier, peu importe le format du chemin
    let fileName = filePath;
    
    // Si c'est un chemin complet (contient C:/ ou autre)
    if (filePath.includes('C:') || filePath.includes('/') || filePath.includes('\\')) {
      // Prendre uniquement le nom du fichier (dernière partie après / ou \)
      const parts = filePath.split(/[\/\\]/);
      fileName = parts[parts.length - 1];
    }
    
    // Utiliser l'endpoint API spécifique pour le téléchargement
    return `http://localhost:3000/api/projets/download/${fileName}`;
  }
}


