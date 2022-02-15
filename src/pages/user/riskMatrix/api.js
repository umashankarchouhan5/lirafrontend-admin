import Ajax from "Utils/ajax";

export const fetchRiskMatrixForYear = (data) => Ajax.post('pqform/RiskMatrix', data);

export const fetchRiskMatrixByID = (data) => Ajax.post('pqform/RiskMatrixForId', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const exportRiskMatrixExcel = (data) => Ajax.post('list/exportRiskMatrixExcel',data);