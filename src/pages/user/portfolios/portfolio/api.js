import Ajax from "Utils/ajax";

export const fetchPortfolio = (data) => Ajax.post('admin/fetchPortfolio',data);

export const getAdminUserList = (data) => Ajax.post('list/GetAdminUserList',data);

export const assignPortfolioToUser = (data) => Ajax.post('admin/assignPortfolio',data);