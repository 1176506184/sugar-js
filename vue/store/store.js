import {createStore} from "vuex";

const store = createStore({
    state() {
        return {
            type: '',
            youtubeVideoData: []
        }
    },
    mutations: {
        changeType(state, n) {
            state.type = n;
        },
        changeYoutubeVideoData(state, n) {
            state.youtubeVideoData = n
        }
    },
    getters: {
        getType(state) {
            return state.type;
        },
        getYoutubeVideoData(state) {
            return state.youtubeVideoData
        }
    }
})

export default store