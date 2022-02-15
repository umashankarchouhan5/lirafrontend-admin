import Ajax from "Utils/ajax";

export const getInspectionItemsQuestions = (data) => Ajax.post('admin/getInspectionItemsQuestions', data);

export const getInspectionById = (data) => Ajax.post('admin/getInspectionById', data);

export const saveInspectionQuestion = (data) => Ajax.post('admin/saveInspectionQuestion', data);

export const getQuestionById = (data) => Ajax.post('admin/getQuestionById', data);
