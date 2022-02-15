import Ajax from "Utils/ajax";

export const getReportData = (data) => Ajax.post('list/getReportData', data);

export const exportIBCStat = (data) => Ajax.post('list/exportIBCStat', data);

export const exportIBCMultiStat = (data) => Ajax.post('list/exportIBCMultiStat', data);

export const getAllStats = (data) => Ajax.post('list/getAllStats', data);