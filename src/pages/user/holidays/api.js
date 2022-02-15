import Ajax from "Utils/ajax";

export const fetchHoliday = (data) => Ajax.post('list/fetchHolidayList',data);

export const deleteHoliday = (id) => Ajax.get(`master/deleteHolidayByID/${id}`);

export const editHoliday = (data) => Ajax.post('master/editHolidayByID', data);

export const addHoliday = (data) => Ajax.post('master/addHoliday', data);

