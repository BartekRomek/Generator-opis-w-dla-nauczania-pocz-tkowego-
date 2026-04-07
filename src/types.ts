export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface EvaluationItem {
  id: string;
  label: string;
  value: Level;
  enabled: boolean;
}

export interface EvaluationSection {
  id: string;
  title: string;
  items: EvaluationItem[];
}

export interface StudentData {
  name: string;
  className: string;
  schoolYear: string;
  gender: 'male' | 'female';
}

export interface EvaluationState {
  student: StudentData;
  sections: EvaluationSection[];
}
