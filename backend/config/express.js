var express = require('express')
, cookieParser = require('cookie-parser')
, bodyParser = require('body-parser')
, logger = require('morgan')

module.exports = function (app, config) {

	app.set('showStackError', true)

	app.use(express.static(config.root + '/public'))
	app.set('views', config.root + '/app/views')
	app.set('view engine', 'ejs')

	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(cookieParser())
	app.use(logger('dev'));

}