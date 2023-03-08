import {createStore} from "vuex";
const store = createStore({
    state () {
        return {
            type: ''
        }
    },
    mutations: {
        changeType (state,n) {
            state.type = n;
        }
    },
    getters:{
        getType(state){
            return state.type;
        }
    }
})

export default store