import Ajax from "Utils/ajax";

export const getRegisteredDocumentListByAdmin = (data) => Ajax.post('list/getRegisteredDocumentListByAdmin', data);

export const getRegisteredDocumentForTicketReferenceByAdmin = (data) => Ajax.post('list/getRegisteredDocumentForTicketReferenceByAdmin', data);

export const acceptRegisteredDocument = (data) => Ajax.post('admin/acceptRegisteredDocument', data);
    