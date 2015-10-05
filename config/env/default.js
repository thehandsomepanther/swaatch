'use strict';


module.exports = {
	app: {
		title: 'swaatch',
		description: 'Task management application made in the MEAN stack.',
		keywords: 'MongoDB, Express, AngularJS, Node.js',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};
