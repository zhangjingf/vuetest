import Vue from 'vue'
import Vuex from 'vuex'
import {mapState, mapGetters} from 'vuex'
if (process.env.NODE_ENV === 'development') {
    Vue.use(Vuex)
}
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment(state, data) {
            state.count += data.count;
            console.log('已触发');
        }
    },
    actions: {
        incrementAsync({ commit }, data) {
            console.log('异步触发');
            console.log(data);
            setTimeout(() => {
                commit('increment', data)
                console.log("zaucduycd");
            }, 1000)
        }
    },
    computed: {
        ...mapState({
            count: state => state.count,
            countAlias: 'count',
            countPlusLocalState (state) {
                return state.count + this.localCount
            }
        }),
        ...mapGetters(['doneTodes'])
    },
    getters: {
        doneTodos: state => {
            return state.count++;
        }
    }
})
export default store;