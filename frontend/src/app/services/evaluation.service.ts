import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Evaluation } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  // Correction de l'URL de base pour correspondre à la structure de l'API
  private apiUrl = `${environment.apiUrl}/api/evaluations`;

  constructor(private http: HttpClient) { }

  // Récupérer toutes les évaluations
  getAllEvaluations(): Observable<Evaluation[]> {
    console.log('Appel API: getAllEvaluations()');
    
    // URL correcte basée sur le routage backend
    const url = `${this.apiUrl}/getev`;
    console.log('URL appelée:', url);
    
    return this.http.get<any[]>(url).pipe(
      retry(1), // Réessayer une fois en cas d'échec
      tap(response => {
        console.log('Réponse brute du serveur:', response);
        console.log('Type de la réponse:', typeof response);
        console.log('Est-ce un tableau?', Array.isArray(response));
        
        if (Array.isArray(response)) {
          console.log('Nombre d\'éléments:', response.length);
          if (response.length > 0) {
            console.log('Structure du premier élément:', JSON.stringify(response[0]));
          }
        }
      }),
      map(evaluations => {
        console.log('Transformation des données...');
        
        if (!Array.isArray(evaluations)) {
          console.error('Les données reçues ne sont pas un tableau');
          return [] as Evaluation[];
        }
        
        const result: Evaluation[] = evaluations
          .map(evaluation => {
            if (!evaluation) {
              console.error('Évaluation null ou undefined');
              return null;
            }
            
            console.log('Traitement de l\'évaluation:', evaluation._id);
            
            try {
              // Vérifier si les propriétés nécessaires existent
              if (!evaluation.rendu) {
                console.error('Propriété rendu manquante dans l\'évaluation:', evaluation);
                return null;
              }
              
              return {
                _id: evaluation._id,
                rendu: evaluation.rendu._id,
                projet: evaluation.projet,
                scores: evaluation.scores,
                dateEvaluation: evaluation.dateEvaluation,
                commentaires: evaluation.commentaires || '',
                // Inclure les propriétés supplémentaires
                renduDetails: evaluation.rendu,
                etudiant: evaluation.rendu.etudiant,
                projetDetails: evaluation.rendu.projet
              } as Evaluation;
            } catch (error) {
              console.error('Erreur lors de la transformation de l\'évaluation:', error);
              return null;
            }
          })
          .filter((item): item is Evaluation => item !== null);
        
        return result;
      }),
      catchError(error => {
        console.error('Erreur HTTP lors de la récupération des évaluations:', error);
        
        let errorMsg = 'Erreur lors de la récupération des évaluations: ';
        
        // Vérifier si c'est une erreur CORS
        if (error.status === 0) {
          errorMsg += 'Problème de connexion réseau ou CORS';
          console.error('Possible erreur CORS ou problème de connexion réseau');
        } else if (error.status === 404) {
          errorMsg += `Endpoint non trouvé (${url})`;
          console.error('Endpoint non trouvé. Vérifiez l\'URL:', url);
        } else {
          errorMsg += error.message || 'Erreur inconnue';
        }
        
        // Retourner un tableau vide avec l'erreur pour éviter de bloquer l'interface
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  // Récupérer une évaluation par ID
  getEvaluationById(id: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    console.error('Erreur détaillée:', error);
    
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      
      // Ajouter des détails supplémentaires si disponibles
      if (error.error && typeof error.error === 'object') {
        errorMessage += ` Détails: ${JSON.stringify(error.error)}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}












