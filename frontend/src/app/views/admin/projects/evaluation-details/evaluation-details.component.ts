import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RendusService } from '@app/services/rendus.service';

@Component({
  selector: 'app-evaluation-details',
  templateUrl: './evaluation-details.component.html',
  styleUrls: ['./evaluation-details.component.css']
})
export class EvaluationDetailsComponent implements OnInit {

  
  renduId: string = '';
  rendu: any = null;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rendusService: RendusService
  ) { }

  ngOnInit(): void {
    this.renduId = this.route.snapshot.paramMap.get('renduId') || '';
    if (this.renduId) {
      this.loadRendu();
    } else {
      this.error = 'ID de rendu manquant';
      this.isLoading = false;
    }
  }

  loadRendu(): void {
    this.isLoading = true;
    this.rendusService.getRenduById(this.renduId).subscribe({
      next: (data: any) => {
        this.rendu = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement du rendu';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getScoreTotal(): number {
    if (!this.rendu?.evaluation?.scores) return 0;
    
    const scores = this.rendu.evaluation.scores;
    return scores.structure + scores.pratiques + scores.fonctionnalite + scores.originalite;
  }

  getScoreMaximum(): number {
    return 20; // 4 critères x 5 points maximum
  }

  getScorePercentage(): number {
    return (this.getScoreTotal() / this.getScoreMaximum()) * 100;
  }

  getScoreClass(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  }

  retourListe(): void {
    this.router.navigate(['/admin/projects/rendus']);
  }
}
