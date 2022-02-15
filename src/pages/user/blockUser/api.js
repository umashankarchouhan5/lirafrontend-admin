import Ajax from 'Utils/ajax';

export const restrictLicensee = (data) => Ajax.post("admin/restrictLicensee", data);

export const blockLicensee = (data) => Ajax.post("admin/blockLicensee", data);

export const searchICSPTypes = (data) => Ajax.post('misc/icsplist',data);