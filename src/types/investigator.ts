export interface UploadedFile {
  name: string;
  base64: string;
  mimeType: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RedactedItem {
  id: string;
  location: string;
  speculation: string;
  confidence: number;
}

export interface Tweet {
  id: string;
  content: string;
  posted: boolean;
}

export type AnalysisStatus = 'idle' | 'proposed' | 'analyzing' | 'complete';

export interface FileInvestigatorState {
  uploadedFile: UploadedFile | null;
  findings: Finding[];
  redactedContent: RedactedItem[];
  tweets: Tweet[];
  summary: string | null;
  analysisStatus: AnalysisStatus;
}

export const INITIAL_STATE: FileInvestigatorState = {
  uploadedFile: null,
  findings: [],
  redactedContent: [],
  tweets: [],
  summary: null,
  analysisStatus: 'idle',
};
