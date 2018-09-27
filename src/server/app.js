'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var debug = require('debug')('wyliodrin-lab-server:app');
require('./database/database.js');
var users = require('./routes/users');
var error = require('./error.js');
var settings = require('./routes/settings.js');
var projects = require('./routes/projects');
var admin = require('./routes/admin');
var boards = require('./routes/boards');
var courses = require('./routes/courses');
var images = require('./routes/raspberrypi');
var statusCodes = require('http-status-codes');
var fs = require('fs-extra');

var LOGS = process.env.WYLIODRIN_LOCAL_LOGS || __dirname + '.logs.json';

async function saveLogs(req, err) {
	var log = {
		requestId: req.requestId,
		logs: req.logs,
		url: req.url,
		params: req.params,
		query: req.query,
		error: err.err.toString(),
		date: Date()
	};
	if (req.body && req.body.password) {
		delete req.body.password;
		log.body = req.body;
	}

	try {
		await fs.appendFile(LOGS, JSON.stringify(log));
	} catch (err) {
		console.error('Error while writing logs to file', err);
	}
}

debug.log = console.info.bind(console);
var app = express();

if (process.env.NODE_ENV !== 'production') app.use(logger('dev'));

var apiv1 = express.Router();

apiv1.use(bodyParser.urlencoded({ extended: false }));
apiv1.use(bodyParser.json());

apiv1.use('/settings', settings);

apiv1.use('/users', users.publicRoutes);
apiv1.use('/courses', courses.publicRoutes);
apiv1.use('/remote', boards.remoteRoutes);

apiv1.use(users.security);

apiv1.use('/boards', boards.privateRoutes);
apiv1.use('/users', users.privateRoutes);
apiv1.use('/images', images.privateRoutes);
apiv1.use('/projects', projects.privateRoutes);
apiv1.use('/courses', courses.privateRoutes);

apiv1.use(admin.adminSecurity);

apiv1.use('/users', users.adminRoutes);
apiv1.use('/boards', boards.adminRoutes);
apiv1.use('/images', images.adminRoutes);
apiv1.use('/courses', courses.adminRoutes);
apiv1.use('/boards', boards.adminRoutes);

apiv1.use(function(req, res) {
	error.sendError(res, error.notFound('Link not found'));
});

app.use('/docs', express.static(path.join(__dirname, '/../docs')));
app.use('/api/v1', apiv1);

app.get('/:boardId([0-9a-f]+)/', function(req, res) {
	// TODO move to boards and verify if board exists
	res.redirect('/lab.html?boardId=' + req.params.boardId);
});

app.use(express.static(path.join(__dirname, '../ui')));

app.get('/', function(req, res) {
	res.redirect('/lab.html');
});

/** */
app.use(function(err, req, res, next) {
	next;
	if (err.status === statusCodes.INTERNAL_SERVER_ERROR) {
		saveLogs(req, err.data);
		error.sendError(res, error.serverError('Something went wrong with your request. (' + err.data.err + ')'));
		req.debug(debug, err);
	} else {
		error.sendError(res, err);
	}
});

module.exports = app;