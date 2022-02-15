import Ajax from "Utils/ajax";

// export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getInspectionTypebyDepartment = (data) => Ajax.post('list/getInspectionTypebyDepartment', data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const getLicenseeList = (data) => Ajax.post('list/getLicenseeList', data);

export const fetchRandomInspectionSample = (data) => Ajax.post('admin/fetchRandomInspectionSample', data);

export const fetchInspectionItem = (data) => Ajax.post('admin/fetchInspectionItem', data);

export const inspectionPlanbyAdminuser = (data) => Ajax.post('admin/inspectionPlanbyAdminuser', data);

export const lockInspectionPlanbyAdminuser = (data) => Ajax.post('admin/lockInspectionPlanbyAdminuser', data);

export const fetchInspectionDetailById = (data) => Ajax.post('admin/fetchInspectionDetailById', data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

export const getInspectionPlanList = (data) => Ajax.post('list/getInspectionPlanList', data);

export const getInspectionStatusList = (data) => Ajax.post('list/getInspectionStatusList', data);

export const fetchInspectionPlanbyId = (data) => Ajax.post('admin/fetchInspectionPlanbyId', data);
//REcord Outcome Specific

export const getInspectionOutcomeList = (data) => Ajax.post('list/getInspectionOutcomeList', data);

export const fetchInspectionOutcomeResponse = (data) => Ajax.post('admin/fetchInspectionOutcomeResponse', data);

export const updateInspectionOutcome = (data) => Ajax.post('admin/updateInspectionOutcome', data);

export const bulkUpdateInspectionNotes = (data) => Ajax.post('admin/bulkUpdateInspectionNotes', data);

export const getCompanyById = (data) => Ajax.post('company/getCompanyById', data);

export const getCompanyStatus = () => Ajax.get('list/getCompanyStatusList/168');

export const uploadRandomSample = (data) => Ajax.post('admin/uploadRandomSample', data);

export const reInspection = (data) => Ajax.post('admin/reInspection', data);

export const uploadDocument = (data) => Ajax.post('admin/adminStorebyProcess', data);

export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getNonCompliants = (data) => Ajax.post('list/getNonCompliants', data);

export const exportINS001Excel = (data) => Ajax.post('list/exportINS001Excel', data);

export const exportINS002Excel = (data) => Ajax.post('list/exportINS002Excel', data);

export const exportINS006Excel = (data) => Ajax.post('list/exportINS006Excel', data);

export const exportINS007Excel = (data) => Ajax.post('list/exportINS007Excel', data);

export const getNonCompliantsWithArea = (data) => Ajax.post('list/getNonCompliantsWithArea', data);

export const generateInspectionLetter = (data) => Ajax.post('admin/generateInspectionLetter', data);

export const getAllInspectionItems = (data) => Ajax.post('list/getAllInspectionItems', data);

export const getCompanyStatusByID = (id) => Ajax.get(`list/getCompanyStatusList/${id}`);

export const createInspectionAncmntLetr = (data) => Ajax.post(`admin/createInspectionAncmntLetr`, data);

export const inspectionPenaltySummary = (data) => Ajax.post(`admin/inspectionPenaltySummary`, data);

export const generateMultiplePenaltyInvoiceByAdmin = (data) => Ajax.post(`admin/generateMultiplePenaltyInvoiceByAdmin`, data);

export const dispatchPenaltyInvoice = (data) => Ajax.post(`admin/dispatchPenaltyInvoice`, data);

export const getICSPLicenses = (data) => Ajax.post('list/getICSPLicenses',data);