import React, { useRef, useMemo } from "react";
import { usePDF } from "@react-pdf/renderer";

const CustomPDF = (data) => {
  // Create refs for each PDF document
  const pdfRefs = useRef(data.map(() => React.createRef()));

  // Use useMemo to create PDF functions once and memoize them
  const pdfFunctions = useMemo(() => {
    return data.map((_, index) => {
      return usePDF({ filename: `page-${index + 1}.pdf`, ref: pdfRefs.current[index] })[0];
    });
  }, [data]);

  return { pdfRefs, pdfFunctions };
};

export default CustomPDF;
