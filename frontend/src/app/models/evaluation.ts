export interface Evaluation {
  _id?: string;  rendu: string;
  projet: string;  scores: {
    structure: number;    pratiques: number;
    fonctionnalite: number;    originalite: number;
    pertinence: number;    qualite: number;
  };  commentaires?: string;
  rapportIA?: any;
  dateEvaluation: Date;
}








