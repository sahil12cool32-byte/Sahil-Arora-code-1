/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import * as pdfjsLib from 'pdfjs-dist';
import { FieldPositions, DEFAULT_FIELD_POSITIONS } from '../types';

// Set worker path to local worker copied into /public
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface PdfAnalysisResult {
  dataUrl: string;
  positions: FieldPositions;
  anchorsFound: number;
}

/**
 * Converts an uploaded File (PDF or Image) into a high-resolution PNG Data URL,
 * and smartly analyzes anchor text positions if it is a PDF.
 */
export async function convertAndAnalyzePdf(file: File): Promise<PdfAnalysisResult> {
  // If user dropped or selected an image file directly
  if (file.type.startsWith('image/')) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      dataUrl,
      positions: { ...DEFAULT_FIELD_POSITIONS },
      anchorsFound: 0,
    };
  }

  // If user dropped or selected a PDF file
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    // 1. High-resolution canvas rendering (scale = 3.0 = 300 DPI for crystal clarity)
    const scale = 3.0;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get 2d context for PDF rendering');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Fill white background first
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Render page to canvas
    const renderContext = {
      canvas: canvas,
      canvasContext: context,
      viewport: viewport,
    };

    // @ts-ignore
    await page.render(renderContext).promise;
    const dataUrl = canvas.toDataURL('image/png', 1.0);

    // 2. Smart Anchor Detection using page.getTextContent()
    const detectedPositions: FieldPositions = { ...DEFAULT_FIELD_POSITIONS };
    let anchorsFound = 0;

    try {
      const textContent = await page.getTextContent();
      const baseViewport = page.getViewport({ scale: 1.0 });
      const pageWidth = baseViewport.width;
      const pageHeight = baseViewport.height;

      interface TextToken {
        str: string;
        x: number; // percentage (0-100)
        y: number; // percentage (0-100)
        width: number; // percentage (0-100)
        height: number; // percentage (0-100)
      }

      const tokens: TextToken[] = [];

      for (const item of textContent.items as any[]) {
        if (!item.str || !item.transform) continue;

        // convertToViewportPoint converts PDF coordinates (origin bottom-left) to canvas coordinates (origin top-left)
        const [vx, vy] = baseViewport.convertToViewportPoint(item.transform[4], item.transform[5]);
        const tokenWidth = (item.width / pageWidth) * 100;
        const tokenHeight = (item.height / pageHeight) * 100;
        const xPercent = (vx / pageWidth) * 100;
        const yPercent = (vy / pageHeight) * 100;

        tokens.push({
          str: item.str.trim(),
          x: xPercent,
          y: yPercent,
          width: tokenWidth,
          height: tokenHeight,
        });
      }

      // Helper to find token matching regex
      const findToken = (pattern: RegExp) => tokens.find((t) => pattern.test(t.str));

      // 1. Locate Dated
      const datedToken = findToken(/Dated\s*:/i);
      if (datedToken) {
        anchorsFound++;
        detectedPositions.dated = {
          top: Math.max(15, datedToken.y - 1.8),
          left: datedToken.x + datedToken.width + 0.8,
          width: Math.min(22, 92 - (datedToken.x + datedToken.width)),
          height: 26,
        };
      }

      // 2. Locate Candidate Name (after Shri/Miss/Mrs.)
      const nameToken = findToken(/Shri\/Miss\/Mrs\.|Miss\/Mrs\.|Shri/i);
      if (nameToken) {
        anchorsFound++;
        detectedPositions.candidateName = {
          top: Math.max(30, nameToken.y - 1.8),
          left: nameToken.x + nameToken.width + 0.8,
          width: 31.0,
          height: 26,
        };
      }

      // 3. Locate Disability/other
      const otherToken = findToken(/Disability\/other|other/i);
      if (otherToken) {
        anchorsFound++;
        detectedPositions.otherDisability = {
          top: Math.max(35, otherToken.y - 1.8),
          left: otherToken.x + otherToken.width + 0.5,
          width: 38.0,
          height: 26,
        };
      }

      // 4. Locate Intake No.
      const intakeToken = findToken(/Intake\s*No\./i);
      if (intakeToken) {
        anchorsFound++;
        detectedPositions.intakeNo = {
          top: Math.max(40, intakeToken.y - 1.8),
          left: intakeToken.x + intakeToken.width + 1.0,
          width: 22.5,
          height: 26,
        };
      }

      // 5. Locate seeking admission in
      const admissionToken = findToken(/seeking\s*admission\s*in/i);
      if (admissionToken) {
        anchorsFound++;
        detectedPositions.course = {
          top: admissionToken.y + 2.4, // Right on the underline below it
          left: 7.0,
          width: 86.0,
          height: 26,
        };
      }

      // 6. Locate Photo Box
      const photoToken = findToken(/^Photo$/i);
      if (photoToken) {
        anchorsFound++;
        detectedPositions.photo = {
          top: photoToken.y - 9.0,
          left: photoToken.x - 7.5,
          width: 17.5,
          height: 198,
        };
      }

      // 7. Locate Roll No.
      const rollToken = findToken(/Roll\s*No\.|Application\s*Form\s*No\./i);
      if (rollToken) {
        anchorsFound++;
        detectedPositions.rollNo = {
          top: rollToken.y - 1.8,
          left: rollToken.x + rollToken.width + 1.0,
          width: 19.0,
          height: 26,
        };
      }

      // 8. Locate Assistant Director
      const signatoryToken = findToken(/Assistant\s*Director/i);
      if (signatoryToken) {
        anchorsFound++;
        detectedPositions.signature = {
          top: signatoryToken.y - 10.0,
          left: signatoryToken.x - 5.0,
          width: 23.0,
          height: 75,
        };
      }
    } catch (analysisErr) {
      console.warn('Text content analysis skipped or failed, using calibrated coordinates', analysisErr);
    }

    return {
      dataUrl,
      positions: detectedPositions,
      anchorsFound,
    };
  }

  throw new Error('Unsupported file format. Please upload a PDF or Image (PNG, JPG).');
}
