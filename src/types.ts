/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FieldBox {
  top: number; // percentage (0-100)
  left: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // in pixels
}

export interface FieldPositions {
  dated: FieldBox;
  candidateName: FieldBox;
  otherDisability: FieldBox;
  intakeNo: FieldBox;
  course: FieldBox;
  photo: FieldBox;
  rollNo: FieldBox;
  signature: FieldBox;
}

export const DEFAULT_FIELD_POSITIONS: FieldPositions = {
  dated: { top: 25.6, left: 77.5, width: 13.5, height: 26 },
  candidateName: { top: 41.8, left: 48.5, width: 31.0, height: 26 },
  otherDisability: { top: 47.4, left: 38.0, width: 38.5, height: 26 },
  intakeNo: { top: 50.3, left: 16.2, width: 22.5, height: 26 },
  course: { top: 53.4, left: 7.0, width: 86.0, height: 26 },
  photo: { top: 65.0, left: 9.25, width: 18.0, height: 198 },
  rollNo: { top: 86.6, left: 35.6, width: 19.0, height: 26 },
  signature: { top: 74.5, left: 69.0, width: 23.0, height: 75 },
};

export const ITI_SUITABILITY_POSITIONS: FieldPositions = {
  dated: { top: 28.09, left: 76.53, width: 16.27, height: 29 },
  candidateName: { top: 45.61, left: 44.4, width: 31, height: 26 },
  otherDisability: { top: 50.17, left: 39.35, width: 36, height: 27 },
  intakeNo: { top: 52.59, left: 10.71, width: 22.5, height: 26 },
  course: { top: 56.26, left: 12.63, width: 28.01, height: 46 },
  photo: { top: 69.44, left: 10.14, width: 17.75, height: 202 },
  rollNo: { top: 91.59, left: 26.65, width: 19, height: 26 },
  signature: { top: 80.11, left: 66.29, width: 23, height: 75 },
};

export interface ReferralFormData {
  fileNo: string;
  dated: string;
  recipientTitle: string;
  recipientDepartment: string;
  recipientAddress: string;
  salutation: string;
  prefix: string; // 'Shri' | 'Miss' | 'Mrs.' | custom
  candidateName: string;
  disabilityCategory: string; // 'orthopaedically Divyang' | 'Visually Impaired' | 'Hearing Impaired' | 'Multiple Disability' | 'Intellectual Disability' | 'other'
  otherDisabilityDetail: string;
  intakeNo: string;
  pronounGender: string; // 'He/she' | 'He' | 'She'
  courseOrAdmissionDetails: string;
  possessivePronoun: string; // 'His/her' | 'His' | 'Her'
  applicationRollNo: string;
  signatoryDesignation: string;
  signatoryDepartment: string;
  signatoryName?: string;
  photoDataUrl: string | null;
  signatureDataUrl: string | null;
  backgroundImageUrl?: string | null;
  pdfFileName?: string | null;
  fieldPositions?: FieldPositions;
  fontStyle?: 'handwritten' | 'print';
  inkColor?: 'blue' | 'black';
}

export const INITIAL_FORM_DATA: ReferralFormData = {
  fileNo: 'B-17017/1/NCSC/Ref./Trq./2025',
  dated: '',
  recipientTitle: 'The Controller (Exams), ITI/Polytechnic',
  recipientDepartment: 'Board of Technical Education, Pitampura,',
  recipientAddress: 'Delhi – 110088',
  salutation: 'Sir/Madam,',
  prefix: 'Shri/Miss/Mrs.',
  candidateName: '',
  disabilityCategory: '',
  otherDisabilityDetail: '',
  intakeNo: '',
  pronounGender: 'He/she',
  courseOrAdmissionDetails: '',
  possessivePronoun: 'His/her',
  applicationRollNo: '',
  signatoryDesignation: 'Assistant Director (Emp.)',
  signatoryDepartment: '',
  signatoryName: '',
  photoDataUrl: null,
  signatureDataUrl: null,
  backgroundImageUrl: '/templates/iti_suitability.png',
  pdfFileName: 'ITI suitability.pdf',
  fieldPositions: ITI_SUITABILITY_POSITIONS,
  fontStyle: 'handwritten',
  inkColor: 'blue',
};

export const SAMPLE_FORM_DATA: ReferralFormData = {
  fileNo: 'B-17017/1/NCSC/Ref./Trq./2025',
  dated: '14/07/2025',
  recipientTitle: 'The Controller (Exams), ITI/Polytechnic',
  recipientDepartment: 'Board of Technical Education, Pitampura,',
  recipientAddress: 'Delhi – 110088',
  salutation: 'Sir/Madam,',
  prefix: 'Shri',
  candidateName: 'Rahul Verma',
  disabilityCategory: 'orthopaedically Divyang',
  otherDisabilityDetail: '',
  intakeNo: 'VRC/DEL/2025/0842',
  pronounGender: 'He/she',
  courseOrAdmissionDetails: 'COPA (Computer Operator and Programming Assistant)',
  possessivePronoun: 'His/her',
  applicationRollNo: 'DEL-2025-COPA-0914',
  signatoryDesignation: 'Assistant Director (Emp.)',
  signatoryDepartment: 'NCSC for Differently Abled',
  signatoryName: 'Dr. A. K. Sharma',
  photoDataUrl: null,
  signatureDataUrl: null,
  backgroundImageUrl: '/templates/iti_suitability.png',
  pdfFileName: 'ITI suitability.pdf',
  fieldPositions: ITI_SUITABILITY_POSITIONS,
  fontStyle: 'handwritten',
  inkColor: 'blue',
};

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isDefault?: boolean;
  backgroundImageUrl: string | null;
  pdfFileName?: string | null;
  fieldPositions: FieldPositions;
  verticalOffset?: number;
}

export const DEFAULT_TEMPLATES: FormTemplate[] = [
  {
    id: 'default-iti-suitability',
    name: 'ITI Suitability Certificate',
    description: 'Official NCSC / ITI Polytechnic suitability certificate with pre-calibrated fillable fields.',
    createdAt: 'Official',
    isDefault: true,
    backgroundImageUrl: '/templates/iti_suitability.png',
    pdfFileName: 'ITI suitability.pdf',
    fieldPositions: ITI_SUITABILITY_POSITIONS,
    verticalOffset: 0,
  },
];

