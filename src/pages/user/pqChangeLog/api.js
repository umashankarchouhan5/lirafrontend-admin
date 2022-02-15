import Ajax from "Utils/ajax";

export const getPQChangeLog = (pq_id) => Ajax.post('pqform/GetPQChangeLog', { pq_id });