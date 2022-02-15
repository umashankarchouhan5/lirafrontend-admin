import {
    getUserDocuments,
    acceptDocumentAction,
    rejectDocumentAction,
    getTicket,
    fetchPaidFees,
    getForwardingUsers,
    getSubordinatesUsers,
    getPQformDetails,
    getPQRecordByPQid,
    getPcAdmin,
    getTicketData,
    fetchCustomEmailTemplateList
} from '../config/api'

import { TicketStrategy } from './ticketStrategy'
import User from '../../../../store/modules/user';
const changesProcesses = [ 109, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 602, 603, 201, 202, 203, 345, 113, 117, 2000, 380, 381, 383, 390, 115, 116, 346, 347, 700, 701, 704, 2001, 401, 402, 106, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 3001, 4001, 2031, 3031, 4031, 2011, 2012, 2013 ];

const onlyPaymentProcesses = [ 102 ];


const onlyDocumentProcesses = [ 406, 407, 408, 600, 601, 804, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048 ];

export default {
    state: {
        isLoading: false,
        documents: [],
        payments: null,
        ticket: null,
        records: {
            AQual: [],
            Addrs: [],
            Bank: [],
            CMemb: [],
            Direc: [],
            Emplr: [],
            KPer: [],
            PQual: [],
            Partn: [],
            PrevA: [],
            Train: [],
            Trust: [],
            Natnl: [],
            Psprt: [],
        },
        checklist: [],
        isAllDocumentsApproved: false,
        forwardingUsers: [],
        forwardingUsersIsLoading: [],
        readOnly: false,
        pcAdmin: [],
        allocatingUsers:[],
        pqRead: null,
        emailTemplateList: [],
        rodNotAllConfirmedCheck: false,
        newCompanyModule: [ 140, 501, 502, 300, 311 ],
    },
    mutations: {
        setRODConfirmCheck(state,data){
            state.rodNotAllConfirmedCheck = data;
        },
        setPcAdmin(state,data){
            state.pcAdmin = data;
        },
        setReadOnly(state,isReadonly){
            state.readOnly = isReadonly;
        },
        setTicket(state, ticket) {
            state.ticket = ticket;
        },
        setPQRead(state, data) {
            state.pqRead = data;
        },
        setChecklist(state, checklist) {
            state.checklist = checklist;
        },
        setRecords(state, records) {
            state.records = records;
        },
        mergeTicket(state, ticket) {
            state.ticket = {
                ...state.ticket,
                ...ticket
            };
        },
        setDocuments(state, documents) {
            state.documents = documents;
        },
        checkAllApproved(state, documents) {
            state.isAllDocumentsApproved = documents.mandatory.every(item => item.isAccepted) && documents.additional.every(item => item.isAccepted && item.isAccepted !== null) && documents.optional.every(item => { 
                if(item.documentdata_id !== null)
                { 
                    return item.isAccepted && item.isAccepted !== null 
                }
                else{
                    return true;
                }
            });
        },
        setLoading(state, value) {
            state.isLoading = value;
        },
        setPayments(state, payments) {
            state.payments = payments;
        },
        setForwardingUsers(state, forwardingUsers) {
            state.forwardingUsers = forwardingUsers;
        },
        setAllocatingUsers(state, allocatingUsers) {
            state.allocatingUsers = allocatingUsers;
        },
        setForwardingUsersLoader(state, forwardingUsersIsLoading) {
            state.forwardingUsersIsLoading = forwardingUsersIsLoading;
        },
        setEmailTemplateList(state, list){
            state.emailTemplateList = list;
        }
    },
    actions: {
        getPQData({ dispatch,commit, state }, data) {
            commit('setLoading', true);
            getTicketData(data).then(response => {
                commit('setLoading', false);
                response.data[0]['process_id'] = 702;
                response.data[0]['pq_id'] = response.data[0].id;
                commit('setPQRead', response.data[0]);
                const { process_id } = response.data[0];
                const strategy = new TicketStrategy();
                strategy.setTicketProcess(process_id);
                strategy.handleStrategy(response.data, { dispatch, commit, state })

            }).catch(() => {
                commit('setLoading', false);
            })
        },
        getDocuments({ commit, state }, data) {
            commit('setLoading', true);
            getUserDocuments(data).then(response => {
                commit('setLoading', false);
                commit('setDocuments', response.data);
                commit('checkAllApproved', response.data);
            }).catch(() => {
                commit('setLoading', false);
            })
        },
        getPayments({ commit, state }, data) {
            commit('setLoading', true);
            fetchPaidFees(data).then(response => {
                commit('setLoading', false);
                commit('setPayments', response.data);
            }).catch(() => {
                commit('setLoading', false);
            })
        },
        acceptDocument({ dispatch, commit, state }, data) {
            commit('setLoading', true);
            acceptDocumentAction(data).then(() => {
                const { process_id, reference_id, pq_id } = state.ticket;
                const data = {
                    process_id,
                    reference_id: process_id === 702 ? pq_id : reference_id,
                };
                dispatch('getDocuments', data);
            }).catch(() => {
                commit('setLoading', false);
            })
        },
        rejectDocument({ dispatch, commit, state }, data) {
            commit('setLoading', true);
            rejectDocumentAction(data).then(() => {
                const { process_id, reference_id, pq_id } = state.ticket;
                const data = {
                    process_id,
                    reference_id: process_id === 702 ? pq_id : reference_id,
                };
                dispatch('getDocuments', data);
            }).catch(() => {
                commit('setLoading', false);
            })
        },
        fetchAllocatingUsers1({ commit }, ) {
            getSubordinatesUsers().then((response) => {
                commit('setAllocatingUsers', response.data);
            })
        },
        fetchAllocatingUsers({ dispatch, commit, state }, ) {
            commit('setForwardingUsersLoader', true);
            getSubordinatesUsers().then((response) => {
                commit('setAllocatingUsers', response.data);
                commit('setForwardingUsersLoader', false);
            }).catch(() => {
                commit('setForwardingUsersLoader', false);
            })
        },
        fetchForwardingUsers({ dispatch, commit, state }, data) {
            commit('setForwardingUsersLoader', true);
            getForwardingUsers(data).then((response) => {
                commit('setForwardingUsers', response.data);
                commit('setForwardingUsersLoader', false);
            }).catch(() => {
                commit('setForwardingUsersLoader', false);
            })
        },
        getTicket({ dispatch, commit, state }, data) {
            commit('setLoading', true);
            getTicket(data).then(response => {
                const { process_id, reference_id, CompanyRegNo, EntityType,step } = response.data[0];
                // TODO: Refactor using strategy
                const data = {
                    process_id,
                    reference_id,
                };
                if(process_id !== 121 && process_id !== 111){
                    const pcData =  {
                        process_id,
                        EntityType,
                        step
                    };
                    getPcAdmin(pcData).then(
                        (res) => {
                            commit('setPcAdmin',res.data[0]);
                            if(res.data[0].CanSendEmail === 1){
                                fetchCustomEmailTemplateList({TicketReference: response.data[0].TicketReference}).then(
                                    res=> {
                                        commit('setEmailTemplateList',res.data);
                                    }
                                )
                            }
                        }
                    )
                }
                else{
                    const pcData =  {
                        process_id,
                        EntityType: 'IBC',
                        step
                    };
                    getPcAdmin(pcData).then(
                        (res) => {
                            commit('setPcAdmin',res.data[0]);
                            if(res.data[0].CanSendEmail === 1){
                                fetchCustomEmailTemplateList({TicketReference: data.ticket_reference}).then(
                                    res=> {
                                        commit('setEmailTemplateList',res.data);
                                    }
                                )
                            }
                        }
                    )
                }
                if (process_id === 702) {
                    const strategy = new TicketStrategy();
                    strategy.setTicketProcess(process_id);
                    strategy.handleStrategy(response.data, { dispatch, commit, state });
                } else {
                    commit('setTicket', response.data[0]);
                    commit('setProcessId', process_id);
                    // TODO: refactor
                    if(onlyPaymentProcesses.indexOf(process_id) !== -1 || (process_id == 111 &&  response.data[0].invoice_id !== null)){
                        
                        dispatch('getPayments', data);
                    }
                    else if (changesProcesses.indexOf(process_id) !== -1
                        || CompanyRegNo
                        || EntityType === 'LP'
                        || EntityType === 'Trust'
                        || EntityType === 'Foundation') {
                        dispatch('getDocuments', data);
                        dispatch('getPayments', data);
                    } 
                    else if(onlyDocumentProcesses.indexOf(process_id) !== -1){
                        dispatch('getDocuments', data);

                    }
                    else {
                        commit('setLoading', false);
                    }
                }
                if(response.data[0].outcome !== null){
                    const isReadonly = response.data[0].outcome == 'APP'|| response.data[0].outcome == 'REJ' || response.data[0].adminuser_id !== User.state.user.user_id ? true : false ;
                    commit('setReadOnly',isReadonly);
                }else{
                    if(response.data[0].adminuser_id === null){
                        commit('setReadOnly', true);
                    }else{
                        const isReadonly =  response.data[0].adminuser_id !== User.state.user.user_id ? true : false ;
                        commit('setReadOnly', isReadonly);
                    }
                }
                

            }).catch(() => {
                commit('setLoading', false);
            })
        },
    }
}
