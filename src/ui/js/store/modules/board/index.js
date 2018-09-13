var Vue = require('vue');
var setup = require('../../setup.js');

// var KEY_TOKEN = 'wyliodrin.token';
// Vue.http.interceptors.push(function(request, next) {
// 	if (window.localStorage.getItem(KEY_TOKEN)) {
// 		request.headers.set('Authorization', 'Bearer ' + window.localStorage.getItem(KEY_TOKEN));
// 	}
// 	next();
// });

module.exports = {
	namespaced: true,
	state: {
		boards: null,
		board: null
	},
	getters: {
		board(state) {
			return state.board;
		},
		boards (state) {
			return state.boards;
		}
	},
	actions: {
		async listBoards (store)
		{
			try {
				// store.commit ('boards', null);
				let response = await Vue.http.get(setup.API + '/boards/list');
				// console.log(response.data.role);
				if (response.data.err === 0) {
					store.commit('boards', response.data.boards);
				}
				return true;
			} catch (e) {
				// console.log('Login fail ' + e);
				return false;
			}
		},
		async getBoard(store) {
			try {
				store.commit ('board', null);
				let response = await Vue.http.get(setup.API + '/boards/user');
				// console.log(response.data.role);
				if (response.data.err === 0) {
					store.commit('board', response.data.board);
				}
				return true;
			} catch (e) {
				// console.log('Login fail ' + e);
				return false;
			}
		},
		async disconnect(store, boardId) {
			try {
				let response = await Vue.http.post(setup.API + '/boards/disconnect', {
					boardId
				});
				// console.log(response.data.role);
				if (response.data.err === 0) {
					return true;	
				}
				return false;
			} catch (e) {
				// console.log('Login fail ' + e);
				return false;
			}
		},
	},
	mutations: {
		boards(state, value) {
			state.boards = value;
		},
		board(state, value) {
			state.board = value;
		},
	}
};