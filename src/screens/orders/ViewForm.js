import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import moment from "moment";

const ViewForm = () => {
  const location = useLocation();
  const data = location.state?.data || [];
  const pdfRefs = useRef(data.map(() => React.createRef()));

  const generatePDFsAndDownloadZip = async () => {
    const zip = new JSZip();

    const pdfPromises = data.map((item, i) => {
      return new Promise((resolve, reject) => {
        const pdfRef = pdfRefs.current[i].current;

        if (!pdfRef) {
          reject(`Reference for item ${i} is missing.`);
          return;
        }

        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Wait for images to load before rendering PDF
        const imagesLoaded = new Promise((resolveImg) => {
          const images = pdfRef.querySelectorAll("img");
          let loadedCount = 0;

          images.forEach((img) => {
            if (img.complete) {
              loadedCount += 1;
            } else {
              img.onload = () => {
                loadedCount += 1;
                if (loadedCount === images.length) {
                  resolveImg();
                }
              };
              img.onerror = () => {
                loadedCount += 1;
                if (loadedCount === images.length) {
                  resolveImg();
                }
              };
            }
          });

          if (images.length === 0 || loadedCount === images.length) {
            resolveImg();
          }
        });

        imagesLoaded.then(() => {
          // Render the content as HTML to the PDF
          setTimeout(() => {
            doc.html(pdfRef, {
              callback: function (doc) {
                // Convert PDF to blob
                const blob = doc.output("blob");

                if (blob.size > 0) {
                  // Add PDF to ZIP file
                  zip.file(`page-${i + 1}.pdf`, blob);
                  resolve();
                } else {
                  reject(`PDF creation failed for item ${i}.`);
                }
              },
              x: 10,
              y: 10,
              html2canvas: { scale: 0.5 }, // Adjust scale to fit content
            });
          }, 1000); // Adjust timeout as needed
        });
      });
    });

    try {
      await Promise.all(pdfPromises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "files.zip");
    } catch (error) {
      console.error("Error generating PDFs or ZIP file:", error);
    }
  };

  return (
    <div>
      <div className="p-5">
        <div className="mx-auto mt-3 flex justify-center">
          <button
            onClick={generatePDFsAndDownloadZip}
            className="text-base cursor-pointer bg-primary text-white py-2.5 px-5 leading-none text-center whitespace-nowrap align-baseline bg-green-200 rounded-md"
          >
            Generate Bulk Order label
          </button>
        </div>
        {data.map((item, index) => (
          <div key={index} ref={pdfRefs.current[index]} className="container_main mt-5">
            <div className="card-container">
              <div className="border rounded-lg mb-3 p-4 flex gap-3">
                <div className="w-48 h-14">
                  <img
                    src={require("../../assets/image/barcode.png")}
                    alt="Sample"
                    className="card-image w-full h-full"
                  />
                </div>
                <div className="w-48 h-16">
                  <img
                    src={require("../../assets/image/logo.png")}
                    alt="Sample"
                    className="card-image"
                  />
                </div>
              </div>
              <div className="flex border gap-3 rounded-lg p-4">
                <div className="text-left w-[45%]">
                  <p className="m-0 border-black font-bold text-black">To :</p>
                  <ul className="border-black py-3">
                    <li className="font-bold text-sm text-black">
                      <span className="text-gray-400 text-md font-normal">
                        {item?.senderAddress1}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="text-left w-[45%]">
                  <p className="m-0 border-black font-bold text-black">From :</p>
                  <ul className="border-black py-3">
                    <li className="font-bold text-sm text-black">
                      <span className="text-gray-400 text-md font-normal">
                        {item?.receiverAddress1}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border my-3 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h5 className="text-lg font-bold">Tracking Number:</h5>
                    <h5>{item?.orderId?.tracking}</h5>
                  </div>
                  <div className="text-left">
                    <div className="bg-gray-200 border py-4 px-2">
                      <div className="w-48 h-12">
                        <img
                          src={require("../../assets/image/barcode.png")}
                          alt="Sample"
                          className="card-image w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex pt-3 justify-between">
                  <div>
                    <h3 className="text-gray-500 font-medium">Ship Date:</h3>
                    <h3 className="text-gray-500">08/15/2024</h3>
                  </div>
                  <div>
                    <h3 className="text-gray-500 font-medium">Delivery Date:</h3>
                    <h3 className="text-gray-500">
                      {moment(item?.createdAt).format("DD-MM-YYYY")}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-white border-2 p-3 rounded-md justify-between gap-3">
                <div>
                  <h4 className="m-0 text-black font-semibold text-left">Powered by:</h4>
                  <div className="flex justify-center items-center h-24 w-32">
                    <img
                      src={require("../../assets/image/slip_logo.jpeg")}
                      alt="Sample"
                      className="mx-auto w-full h-full"
                    />
                  </div>
                </div>
                <div className="text-left">
                  <h5 className="font-semibold text-black text-lg">Shipment Information:</h5>
                  <ul className="p-0">
                    <li>Pieces: {item?.itemNumber}</li>
                    <li>COD Amount: {item?.codAmount}</li>
                    <li>Order ID: {item?.orderId?._id}</li>
                    <li>Origin: {item?.senderArea}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewForm;
