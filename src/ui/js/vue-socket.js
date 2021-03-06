// var WebSocket = require ('ws');
var EventEmitter = require ('events').EventEmitter;
var _ = require ('lodash');
var msgpack = require ('msgpack5')();
var ReconnectingWebSocket = require ('reconnectingwebsocket');

module.exports.install = function (Vue)
{
	var socket = null;
	var authenticated = false;
	var connected = false;

	setInterval (function ()
	{
		if (socket && connected && authenticated)
		{
			Vue.socket.send ('ping');
		}
	}, 10000);

	Vue.socket = _.assign (new EventEmitter(), {
		send: function (label, data)
		{
			if (socket && (authenticated || label === 'a'))
			{
				let packet = _.assign ({
					l:label, 
				}, data);
				console.log (packet);
				socket.send (msgpack.encode (packet).toString ('base64'));
			}
			else
			{
				console.log ('Socket is not authetnicated');
			}
		},
		connect (token)
		{
			let authenticate = function ()
			{
				if (_.isFunction (token))
				{
					let t = token ();
					if (t)
					{
						Vue.socket.send ('a', {token:t});
					}
					else
					{
						setTimeout (authenticate, 1000);
					}
				}
				else
				{
					Vue.socket.send ('a', {token: token});
				}
			};
			socket = new ReconnectingWebSocket ((location.protocol==='http:'?'ws':'wss')+'://'+location.hostname+':'+location.port+'/socket/user');
			// socket.on ('packet', function ()
			// {
			// 	Vue.socket.emit ('packet', arguments);
			// });
			socket.onopen = function ()
			{
				connected = true;
				console.log ('UI Socket connected');
				Vue.socket.emit ('status', {
					status: 'authenticate'
				});
				authenticate ();
				// console.log ('UI Socket sent authenticate');
			};
			// socket.on ('reconnect', function ()
			// {
			// 	console.log ('UI Socket reconnected');
			// 	socket.emit ('authenticate', {
			// 		token: token
			// 	});
			// });
			// socket.on ('authenticate', function (data)
			// {
			// 	authenticated = data.authenticated || false;
			// });
			socket.onmessage = function (evt)
			{
				let m = evt.data;
				// console.log (m);
				try
				{
					let data = msgpack.decode (new Buffer (m, 'base64'));
					console.log (data);
					if (data.l === 'a')
					{
						if (data.err === 0)
						{
							authenticated = true;
							Vue.socket.emit ('status', {
								status: 'connected'
							});
							console.log ('Socket authenticated');
						}
					}
					// else
					// if (data.l === 'p')
					// {
					// 	let packet = msgpack.decode (new Buffer(data.data, 'base64'));
					// 	// console.log (packet);
					// 	Vue.socket.emit ('packet', data.productId, packet);
					// 	Vue.socket.emit ('packet:'+data.productId, packet);
					// }
					else
					{
						Vue.socket.emit (data.l, data);
					}
				}
				catch (e)
				{
					console.error ('UI Socket '+e.message);
				}
			};
			socket.onerror = function (err)
			{
				console.error ('UI Socket '+err.message);
			};
			socket.onclose = function ()
			{
				connected = false;
				authenticated = false;
				Vue.socket.emit ('status', {
					status: 'disconnected'
				});
				console.log ('UI Socket disconnected');
			};
			return socket;
		},
		disconnect ()
		{
			socket.refresh ();
		}
	});
};