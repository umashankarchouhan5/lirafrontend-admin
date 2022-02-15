import {
    getUserDocuments,
    acceptDocumentAction,
    getTicket,
    fetchPaidFees,
    getForwardingUsers,
    getPQChecklistDataByPQId,
    getPQformDetails,
    getPQRecordByPQid
} from '../config/api'

import {
    getIdentificationTypes,
    getQualificationTypes,
} from 'Pages/master/masterActions'

export default {
    702: {
        handle(data, { commit }) {
            const { process_id, pq_id } = data[0];
            commit('setLoading', true);
            commit('setTicket', data[0]);
            commit('setProcessId', process_id);
            Promise.all([
                getUserDocuments({
                    process_id,
                    reference_id: pq_id,
                }),
                getPQformDetails({ pq_id }),
                getPQRecordByPQid(pq_id),
                getPQChecklistDataByPQId(pq_id),
                getIdentificationTypes(),
                getQualificationTypes()
            ]).then((response) => {
                commit('setDocuments', response[0].data);
                commit('checkAllApproved', response[0].data);
                commit('mergeTicket', response[1].data[0]);
                commit('setRecords', response[2].data);
                commit('setChecklist', response[3].data);
                commit('setIdentificationType', response[4].data);
                commit('setQualificationTypes', response[5].data);
                commit('setLoading', false);
            }).catch(() => {
                commit('setLoading', false);
            });
        }
    }
};


