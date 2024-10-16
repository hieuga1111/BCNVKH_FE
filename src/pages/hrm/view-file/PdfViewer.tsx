'use client'; // Đánh dấu Client Component

// src/components/PdfViewer.js
import React, { useEffect, useState } from 'react';
import * as PDFJS from 'pdfjs-dist/build/pdf';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

// Dynamically import pdfjs only on the client-side

const PdfViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  const [pdfDocument, setPdfDocument] = useState<any>();
  const [currentPages, setCurrentPages] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const loadPdf = async () => {
      // Set workerSrc dynamically (required by pdfjs)

      const loadingTask = PDFJS.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
    };

    if (typeof window !== 'undefined') {
      loadPdf(); // Ensure PDF loading only happens client-side
    }
  }, [pdfUrl]);

  const renderPage = (pageNum: any) => {
    return (
      <div key={pageNum} style={{ marginBottom: '20px' }}>
        <canvas id={`pdf-page-${pageNum}`} />
      </div>
    );
  };

  useEffect(() => {
    if (pdfDocument) {
      currentPages.forEach(async (pageNum) => {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.getElementById(`pdf-page-${pageNum}`)as HTMLCanvasElement | null;
        if (canvas !== null) {
          // Tiến hành vẽ trên canvas
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
          // Thực hiện các thao tác khác
        } else {
          console.error("Canvas element not found");
        }
       
      });
    }
  }, [pdfDocument, currentPages]);

  const handleNextPages = () => {
    setCurrentPages((prev) => prev.map((page) => page + 5));
  };

  const handlePreviousPages = () => {
    setCurrentPages((prev) => prev.map((page) => Math.max(page - 5, 1)));
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div>
        {currentPages.map((pageNum) => renderPage(pageNum))}
        <button className=' m-1 button-table button-create' style={{display: 'inline'}}onClick={handlePreviousPages}>Previous</button>
        <button className=' m-1 button-table button-create' style={{display: 'inline'}} onClick={handleNextPages}>Next</button>
      </div>
    </div>
  );
};

export default PdfViewer;

