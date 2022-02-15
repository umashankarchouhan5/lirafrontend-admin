import Ajax from "Utils/ajax";


export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const getEntityType = (data) => Ajax.post('list/entitytype', data);

export const getInclistAdmin = (data) => Ajax.post('namereservation/getInclistAdmin', data);

export const AllotUniqueNumberAdmin = (data) => Ajax.post('namereservation/AllotUniqueNumberAdmin', data);

export const SendEmailByAdmin = (data) => Ajax.post('admin/SendEmailByAdmin', data);
