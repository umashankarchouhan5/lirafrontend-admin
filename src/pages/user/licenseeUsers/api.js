import Ajax from "Utils/ajax";

export const getICSP = (data) => Ajax.post(`misc/icsplist`,data);

export const getWebuserForAdmin = (data) => Ajax.post(`admin/getWebuserForAdmin`,data);

export const restrictWebusers = (data) => Ajax.post(`admin/restrictWebusers`,data);

export const blockWebusers = (data) => Ajax.post(`admin/blockWebusers`,data);