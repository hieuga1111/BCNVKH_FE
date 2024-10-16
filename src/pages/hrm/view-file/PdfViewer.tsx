'use client'; // Đánh dấu Client Component

// src/components/PdfViewer.js
import React, { useEffect, useState } from 'react';
import * as PDFJS from 'pdfjs-dist/build/pdf';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

// Dynamically import pdfjs only on the client-side

const PdfViewer = ({ pdfUrl, total }: { pdfUrl: string, total: string }) => {
  const [pdfDocument, setPdfDocument] = useState<any>();
  const [currentPages, setCurrentPages] = useState([1]);
  const [listpage, setListPages] = useState<any>([1, 2, 3, 4, 5]);

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
    const temp = Array.from({ length: Math.min(currentPages[0] + 4, parseInt(total)) - currentPages[0] + 1 }, (_, i) => currentPages[0] + i);
    setListPages(temp)

  
  }, [pdfDocument, currentPages]);
  useEffect(() => {
    if (pdfDocument) {
      listpage.forEach(async (pageNum: any) => {
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
  }, [listpage]);
  const handleNextPages = () => {
    setCurrentPages((prev) => prev.map((page) => page + 5));
    document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;

  };

  const handlePreviousPages = () => {
    setCurrentPages((prev) => prev.map((page) => Math.max(page - 5, 1))); 
    document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
      <div>
        {listpage.map((pageNum: any) => renderPage(pageNum))}
        <button className=' m-1 button-table button-create' style={{display: 'inline'}}onClick={handlePreviousPages}>Previous</button>
        <button className=' m-1 button-table button-create' style={{display: 'inline'}} onClick={handleNextPages}>Next</button>
      </div>
    </div>
  );
};

export default PdfViewer;

