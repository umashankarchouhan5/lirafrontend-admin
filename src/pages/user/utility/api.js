import Ajax from "Utils/ajax";

export const uploadPdfToSplit = (data) => Ajax.post('admin/uploadPdfToSplit', data);

export const getSplittedPdf = (data) => Ajax.post('admin/getSplittedPdf', data);

export const mergeSplittedPdf = (data) => Ajax.post('admin/mergeSplittedPdf', data);

export const stampsList = () => Ajax.get('admin/stampsList');

export const addWatermark = (data) => Ajax.post('admin/addWatermark', data);

export const pdfToHtml = (data) => Ajax.post('pdfToHtml', data);

export const htmlToPdf = (data) => Ajax.post('htmlToPdf', data);