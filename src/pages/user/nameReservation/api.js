import Ajax from "Utils/ajax";

export const getNameList = (data) => Ajax.post('namereservation/getNamelistAdmin',data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);

export const getStatuses = (data) => Ajax.post('list/fetchAdminFilterStatusList', data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getProcesses = (data) => Ajax.post('list/fetchSubProcess', data);

export const getProcessTypes = () => Ajax.get('list/fetchDefinitionChildrenByName/ProcessType');
 
export const createByAdmin = (data) => Ajax.post('namereservation/createByAdmin',data);

export const updatedetailsByAdmin = (data) => Ajax.post('namereservation/updatedetailsByAdmin',data);

export const TransferName = (data) => Ajax.post('namereservation/TransferName',data);

export const ReReserve = (data) => Ajax.post('namereservation/ReReserve',data);

export const fetchNameforNameId = (data) => Ajax.post('namereservation/fetchNameforNameId', data);

export const getApprovedNames = (data) => Ajax.post('list/getApprovedNames', data);

export const getNameReservationBatchList = (data) => Ajax.post('list/getNameReservationBatchList', data);

export const updateBatchAdminUser = (data) => Ajax.post('admin/updateBatchAdminUser', data);

export const generateLetter = (data) => Ajax.post('admin/generateLetter',data);

export const sendLetter = (data) => Ajax.post('admin/sendLetter', data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList', data);