import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from './models'

const initialState: IInitialState  = {
    isAuthLoading: false,
    isAuthenticated: false,
    accessToken: '',
    refreshToken: '',
    userData: null,
    leadData: null,
    isleadDetailsLoading: false,
    showAlert: false,
    alertMessage: '',
    alertType: undefined,
    comments: [],
    showValidateOtp: false,
    referList: [],
    ticketsList: [],
}

const CTFStore = createSlice({
  name: "store",
  initialState,
  reducers: {
    authSuccess: (state, action) => {
        const { access, refresh } = action.payload
        state.accessToken = access
        state.refreshToken = refresh
        state.isAuthenticated = true
    },
    authLogout: (state, action) => {
        state.accessToken = action.payload
        state.refreshToken = action.payload
        state.isAuthenticated = false
    },
    setUserData: (state, action) => {
        state.userData = action.payload
    },
    authLoading: (state, action) => {
        state.isAuthLoading = action.payload
    },
    setLeadDetails: (state, action) => {
        state.leadData = action.payload
    },
    leadingDetailsLoading: (state, action) => {
        state.isleadDetailsLoading = action.payload
    },
    setError:(state, action) => {
        state.showAlert = action.payload.status;
        state.alertMessage = action.payload.message;
        state.alertType = action.payload.type
    },
    setComments:(state, action) => {
        state.comments = action.payload;
    },
    setReferals:(state, action) => {
        state.referList = action.payload;
    },
    setTickets:(state, action) => {
        state.ticketsList = action.payload;
    },
    setShowValidateOtp: (state, action) => {
        state.showValidateOtp = action.payload;
    },
    clearData:(state) => {
        state.accessToken = ''
        state.refreshToken = ''
        state.userData = null
        state.leadData = null
        state.isAuthenticated = false
        state.comments = []
        state.referList = []
    },
  },
});

export const { 
    authSuccess,
    authLogout,
    setUserData,
    authLoading,
    setLeadDetails,
    leadingDetailsLoading,
    setError,
    setComments,
    clearData,
    setShowValidateOtp,
    setReferals,
    setTickets
 } = CTFStore.actions;

export default CTFStore.reducer;