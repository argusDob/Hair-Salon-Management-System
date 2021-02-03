import Axios from "axios";

const state = {
    closedDates:[],
    theSelectedClosedDate:[]
};

const mutations = {
  SET_CLOSED_DATES: (state, payload) => {
    const theClosedDates = [];
    if(payload[0] !== null){
    const map = new Map();
    for (const holidays of payload) {
    if(!map.has(holidays._id)){
        map.set(holidays._id, true);    // set any value to Map
        theClosedDates.push({
            _id: holidays._id,
            name: holidays.name,
            date: new Date(holidays.date).toDateString()
           });
    }
  }
}
  state.closedDates = payload;
  },
  FIND_THE_CLOSED_DATE:(state,theClosedDate) =>  { 
    state.theSelectedClosedDate = theClosedDate.closedDates.filter((test) => test._id === theClosedDate.theSelectedClosedDateId) 
  },
  SET_THE_NEW_CLOSED_DATE:(state, payload) => {
        state.closedDates.push(payload);
  },
  SET_THE_UPDATED_CLOSED_DATE:(state,payload) => {
      const theUpdatedClosedDate = payload;
      const theClosedDates = state.closedDates;
      theClosedDates.forEach(closedDate => {
          if(closedDate._id === theUpdatedClosedDate._id){
            closedDate.name = theUpdatedClosedDate.name;
            closedDate.date = theUpdatedClosedDate.date;
          }
      });    
  }
};

const getters = {
  returnClosedDates: state => {
    return state.closedDates;
  },
  returnTheSelectedClosedDate: state => {
    return state.theSelectedClosedDate;
  },
 
  }

const actions = {
  async addClosedDates(context, payload) {
    return new Promise((resolve, reject) => {
      Axios.post("http://localhost:3000/closedDates/add", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          resolve(response);
          context.commit("SET_CLOSED_DATES", payload);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  async getClosedDates(context) {
    return new Promise((resolve, reject) => {
      Axios.get("http://localhost:3000/employeeSchedule/all", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(response) {
          console.log(response);
          context.commit("SET_CLOSED_DATES", response.data.theClosedDates);

          resolve(response);
        })
        .catch(function(error) {
          console.log(error);
          reject(error);
        });
    });
  },
 
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
