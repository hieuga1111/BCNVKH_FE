'use client'; // Đánh dấu Client Component

// src/components/PdfViewer.js
import React, { useEffect, useState } from 'react';
import * as PDFJS from 'pdfjs-dist/build/pdf';
import { showMessage } from '@/@core/utils';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver'
import { downloadFile } from '@/services/apis/shift.api';
import { useRouter } from 'next/router';

// Dynamically import pdfjs only on the client-side

const PdfViewer = ({ pdfUrl, total, id }: { pdfUrl: string, total: string, id: any }) => {
  const [pdfDocument, setPdfDocument] = useState<any>();
  const [currentPages, setCurrentPages] = useState([1]);
  const [listpage, setListPages] = useState<any>([1, 2, 3, 4, 5]);
  const router = useRouter();

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
        <canvas id={`pdf-page-${pageNum}`} style={{ maxWidth: '1163px' }} />
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
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.getElementById(`pdf-page-${pageNum}`) as HTMLCanvasElement | null;
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
  const [scale, setScale] = useState(1);
  const handlePreviousPages = () => {
    setCurrentPages((prev) => prev.map((page) => Math.max(page - 5, 1)));
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  const zoomOut = () => {
    if (pdfDocument) {
      listpage.forEach(async (pageNum: any) => {
        const page = await pdfDocument.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale - 0.1 });
        const canvas = document.getElementById(`pdf-page-${pageNum}`) as HTMLCanvasElement | null;
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
    setScale(scale - 0.1);
  };

  const zoomIn = () => {
    listpage.forEach(async (pageNum: any) => {
      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale: scale + 0.1 });
      const canvas = document.getElementById(`pdf-page-${pageNum}`) as HTMLCanvasElement | null;
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
    setScale(scale + 0.1);

  };

  const handlePrint = () => {
    const swalDeletes = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-secondary',
        cancelButton: 'btn btn-danger ltr:mr-3 rtl:ml-3',
        popup: 'confirm-popup confirm-delete',
      },
      imageUrl: '/assets/images/delete_popup.png',
      buttonsStyling: false,
    });
    swalDeletes
      .fire({
        title: `Bạn muốn tải tài liệu?`,
        padding: '2em',
        html: `
                <input id="swal-input1" placeholder="Từ trang"  class="swal2-input">
                <input id="swal-input2" placeholder="Đến trang" class="swal2-input">
            `,
        focusConfirm: false,
        preConfirm: () => {
          return [
            (document.getElementById("swal-input1") as HTMLInputElement).value,
            (document.getElementById("swal-input2") as HTMLInputElement).value,
          ];
        },
        showCancelButton: true,
        cancelButtonText: `Hủy`,
        confirmButtonText: `Xác nhận`,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          const data = {
            startPage: (document.getElementById("swal-input1") as HTMLInputElement).value,
            endPage: (document.getElementById("swal-input2") as HTMLInputElement).value
          }
          downloadFile(
            data, id,
          ).then(async (res) => {
            fetch(`http://103.57.223.140:3001/${res.path}`).then((response) => {
              response.blob().then((blob) => {

                // Creating new object of PDF file
                saveAs(blob, `${router.query.path}`)
              });
            });
            showMessage(`${res.mess}`, 'success');
          }).catch((err) => {
            showMessage(`${err.response.data.mess}`, 'error');
          });
        }
      });
  }
  return (
    <div>
      <button type="button" className=" m-1 button-table button-create" style={{ display: 'inline' }} onClick={() => handlePrint()}>
        Tải tài liệu
      </button>
      <button className=' m-1 button-table button-create' style={{ display: 'inline' }} onClick={zoomIn}> Zoom in</button>
      <button className=' m-1 button-table button-create' style={{ display: 'inline' }} onClick={zoomOut}>Zoom Out</button>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

        <div>

          {listpage.map((pageNum: any) => renderPage(pageNum))}
          <button className=' m-1 button-table button-create' style={{ display: 'inline' }} onClick={handlePreviousPages}>Trang trước</button>
          <button className=' m-1 button-table button-create' style={{ display: 'inline' }} onClick={handleNextPages}>Trang sau</button>
        </div>
      </div>
    </div>

  );
};

export default PdfViewer;

