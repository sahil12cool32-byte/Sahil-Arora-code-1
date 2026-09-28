/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { jsPDF } from 'jspdf';
import { ReferralFormData, DEFAULT_FIELD_POSITIONS } from '../types';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Composites the high-res background image, candidate photo, signature,
 * and filled text onto an ultra-sharp off-screen canvas (3x resolution).
 */
export async function generateCompositedCanvas(
  data: ReferralFormData,
  verticalOffset: number = 0
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  // 800 x 1131 standard A4 ratio, rendered at 3x scale = 2400 x 3393 px for print clarity
  const scale = 3.0;
  canvas.width = 800 * scale;
  canvas.height = 1131 * scale;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Failed to get 2D context');

  // Fill pure white first
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Background Image
  if (data.backgroundImageUrl) {
    try {
      const bgImg = await loadImage(data.backgroundImageUrl);
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.warn('Could not render background image for export', err);
    }
  }

  const positions = data.fieldPositions || DEFAULT_FIELD_POSITIONS;

  // Helper to calculate pixel bounds from percentage box
  const getBoxPixels = (box: { top: number; left: number; width: number; height: number }) => {
    return {
      x: (box.left / 100) * 800 * scale,
      y: ((box.top / 100) * 1131 + verticalOffset) * scale,
      w: (box.width / 100) * 800 * scale,
      h: box.height * scale,
    };
  };

  // 2. Draw Candidate Photo
  if (data.photoDataUrl) {
    try {
      const photoImg = await loadImage(data.photoDataUrl);
      const pb = getBoxPixels(positions.photo);
      ctx.drawImage(photoImg, pb.x, pb.y, pb.w, pb.h);
    } catch (err) {
      console.warn('Could not render photo in export', err);
    }
  }

  // 3. Draw Signature
  if (data.signatureDataUrl) {
    try {
      const sigImg = await loadImage(data.signatureDataUrl);
      const sb = getBoxPixels(positions.signature);
      // Fit signature nicely
      const aspect = sigImg.width / sigImg.height;
      let drawW = sb.w;
      let drawH = sb.w / aspect;
      if (drawH > sb.h) {
        drawH = sb.h;
        drawW = sb.h * aspect;
      }
      const drawX = sb.x + (sb.w - drawW) / 2;
      const drawY = sb.y + (sb.h - drawH) / 2;
      ctx.drawImage(sigImg, drawX, drawY, drawW, drawH);
    } catch (err) {
      console.warn('Could not render signature in export', err);
    }
  }

  // 4. Draw Text Overlays
  const isHandwritten = data.fontStyle !== 'print';
  if (isHandwritten && typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  const inkColor = data.inkColor === 'black' ? '#18181b' : '#0f3987';
  ctx.fillStyle = isHandwritten ? inkColor : '#000000';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  const textFields = [
    {
      text: data.dated,
      box: positions.dated,
      fontSize: (isHandwritten ? 19 : 15) * scale,
    },
    {
      text: data.candidateName,
      box: positions.candidateName,
      fontSize: (isHandwritten ? 20.5 : 15.5) * scale,
    },
    {
      text: data.otherDisabilityDetail || data.disabilityCategory,
      box: positions.otherDisability,
      fontSize: (isHandwritten ? 18.5 : 14) * scale,
    },
    {
      text: data.intakeNo,
      box: positions.intakeNo,
      fontSize: (isHandwritten ? 19 : 14.5) * scale,
    },
    {
      text: data.courseOrAdmissionDetails,
      box: positions.course,
      fontSize: (isHandwritten ? 19.5 : 15) * scale,
    },
    {
      text: data.applicationRollNo,
      box: positions.rollNo,
      fontSize: (isHandwritten ? 18.5 : 14) * scale,
    },
  ];

  for (const field of textFields) {
    if (!field.text) continue;
    const b = getBoxPixels(field.box);
    if (isHandwritten) {
      ctx.font = `650 ${field.fontSize}px "Caveat", "Kalam", cursive, sans-serif`;
    } else {
      ctx.font = `bold ${field.fontSize}px "Noto Serif", "Times New Roman", serif`;
    }
    // Draw centered on underline
    ctx.fillText(field.text, b.x + b.w / 2, b.y + b.h / 2);
  }

  return canvas;
}

/**
 * Downloads the completed form as a true PDF file directly to disk.
 */
export async function downloadFormAsPdf(
  data: ReferralFormData,
  verticalOffset: number = 0,
  filename: string = 'NCSC_Admission_Referral_Form.pdf'
): Promise<void> {
  const canvas = await generateCompositedCanvas(data, verticalOffset);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // A4 dimensions in pt
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  pdf.save(filename);
}

/**
 * Downloads the completed form as a high-resolution PNG image directly to disk.
 */
export async function downloadFormAsImage(
  data: ReferralFormData,
  verticalOffset: number = 0,
  filename: string = 'NCSC_Admission_Referral_Form.png'
): Promise<void> {
  const canvas = await generateCompositedCanvas(data, verticalOffset);
  const dataUrl = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
