import Ajax from "Utils/ajax";

export const getTicketData = (data) => Ajax.post('pqform/getPQFormData ', data);

export const getTicketv2 = (data) => Ajax.post('admin/tasks/ticketv2', data);

export const getSubordinatesUsers = () => Ajax.post('admin/tasks/ticket/subordinates');

export const fetchPerson = (data) => Ajax.post('webuser/fetchPerson',data);

export const getICSPRequestpeople = (data) => Ajax.post('webuser/getICSPRequestpeople',data);

export const assignTicket = (data) => Ajax.post('admin/AssignTicket',data);  

export const getPcAdmin = (data) => Ajax.post('admin/tasks/ticket/getpcadmin',data);

export const getTicket = (data) => Ajax.post('admin/tasks/ticket', data);

export const checkSimilarName = (data) => Ajax.post('namereservation/checksimilarname', data);

export const saveCheckList = (data) => Ajax.post('admin/tasks/checklist/action', data);

export const generateDecisionEmail = (data) => Ajax.post('admin/GenerateDecisionEmailnew', data);

export const processDecision = (data) => Ajax.post('admin/processDecision', data);

export const processTicket = (data) => Ajax.post('admin/processticketnew', data);

export const getUserDocuments = (data) => Ajax.post('admin/tasks/ticket/documents', data);

//payment api's start

// export const fetchPaidFees = (data) => Ajax.post('admin/FetchFeesPaid', data);
export const fetchPaidFees = (data) => Ajax.post('admin/FetchFeesPaidv2', data);

export const fetchReceiptByInvoiceId = (data) => Ajax.post(`webuser/fetchReceiptByInvoiceId`,data);

//payment api's end

//document action api start
export const acceptDocumentAction = (data) => Ajax.post('admin/tasks/document/accept', data);

export const rejectDocumentAction = (data) => Ajax.post('admin/tasks/document/reject', data);

//forward user apis
export const getForwardingUsers = (data) => Ajax.post('admin/tasks/ticket/forwardingusers', data);

export const forwardTicket = (data) => Ajax.post('utilities/allocateAdminUser', data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

//pq data apis
export const getPQRecordByPQid = (pq_id) => Ajax.post('pqform/getPQRecordByPQid', { pq_id });

export const getPQformDetails = (data) => Ajax.post('pqform/getPQformDetails', data);

export const uploadDocumentPQ = (data) => Ajax.post('pqform/file/upload', data);

export const getPQChecklistDataByPQId = (pq_id) => Ajax.post('pqform/getPQChecklistDataByPQId', { pq_id });

export const getPQChangeLog = (pq_id) => Ajax.post('pqform/GetPQChangeLog', { pq_id });

//observation apis
export const updateObservation = (data) => Ajax.post('admin/UpdateObservation', data);

export const getDepartments = (data) => Ajax.post('list/fetchDataFromMaster', data);

export const fetchRoles = (data) => Ajax.post(`master/FetchRolesForDepartment `, data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);

// custom template api
export const fetchCustomEmailTemplateList = (data) => Ajax.post('admin/fetchCustomEmailTemplateList', data);

export const fetchTicketEmailData = (data) => Ajax.post('admin/fetchTicketEmailData', data);

export const sendEmailByAdmin = (data) => Ajax.post('admin/SendEmailByAdmin', data);

export const fetchPQAssessmentRecord = (data) => Ajax.post('pqform/fetchPQAssessmentRecord', data);

export const getPersonbyName = (data) => Ajax.post('list/getPersonbyName', data);

export const getCompany = (data) => Ajax.post('list/getcompanysearch', data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const fetchEntityTypeByDepartment = (data) => Ajax.post('admin/fetchEntityTypeByDepartment', data);

export const getRFIType = () => Ajax.get('list/fetchDefinitionChildrenByName/RFIType');

export const getRFINature = () => Ajax.get('list/fetchDefinitionChildrenByName/RFINature');

export const fetchAdminDocuments = (data) => Ajax.post('admin/fetchAdminDocuments', data);

//Strike Off Reasosns
export const getStrikeOffReason = (data) => Ajax.post('list/getStrikeOffReason', data);

//RepCode
export const fetchAttachedLicenseToRep = (data) => Ajax.post('list/attachedLicenseToRep', data);

//ROD apis
export const viewCompanyDirectors = (data) => Ajax.post('admin/viewCompanyDirectors', data);

export const acknowledgeRODIBC = (data) => Ajax.post('admin/acknowledgeRODIBC', data);

export const confirmRODIBC = (data) => Ajax.post('admin/confirmRODIBC', data);

export const uploadFile = (data) => Ajax.post('admin/adminfile/upload', data);

//Annual Renewal apis
export const annualRenewalRequestApprovalByadminUser = (data) => Ajax.post('admin/annualRenewalRequestApprovalByadminUser', data);

export const annualRenewalApprovedSummary = (data) => Ajax.post('admin/annualRenewalApprovedSummary', data);
  
export const getCompanyCompliances = (data) => Ajax.post('company/getCompanyCompliances', data);

//asssign deadline
export const assignDeadline = (data) => Ajax.post('admin/assignDeadline', data);

//  get signee list
export const getSigneeList = (data) => Ajax.post('list/getSigneeList', data);

//enforcement status
export const getEnforcementStatus = () => Ajax.get('list/getCompanyStatusList/174');

//enforcement by admin
export const enforcementByAdminUser = (data) => Ajax.post('admin/enforcementByAdminUser', data);

//restrict /block

export const restrictLicensee = (data) => Ajax.post(`admin/restrictLicensee`,data);

export const blockLicensee = (data) => Ajax.post(`admin/blockLicensee`,data);