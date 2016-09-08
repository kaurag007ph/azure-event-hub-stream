'use strict';

var platform = require('./platform');


/**
 * Emitted when the platform shuts down the plugin. The Stream should perform cleanup of the resources on this event.
 */
platform.once('close', function () {
	let d = require('domain').create();

	d.once('error', function (error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
		d.exit();
	});

	d.run(function () {
		// TODO: Release all resources and close connections etc.
		platform.notifyClose(); // Notify the platform that resources have been released.
		d.exit();
	});
});

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 * Afterwards, platform.notifyReady() should be called to notify the platform that the init process is done.
 * @param {object} options The parameters or options. Specified through config.json.
 */
platform.once('ready', function (options) {
	/*
	 * Initialize your stream using the options. See config.json
	 * You can customize config.json based on the needs of your plugin.
	 * Reekoh will inject these configuration parameters as options here in the ready event.
	 *
	 * Note: Option Names are based on what you specify on the config.json.
	 */

	// TODO: Initialize your client or subscribe to the 3rd party service here.

	/*
	 * Sample Code
	 *
	 * var service = require('service');
	 *
	 * service.connect(options, function (error, serviceClient) {
	 * 	client = serviceClient;
	 * });
	 */

	var EventHubClient = require('azure-event-hubs').Client;
	var client = EventHubClient.fromConnectionString(options.connectionString, options.eventName);
 	var partitionId = options.partitionId;
	
	client.createReceiver('$Default', partitionId, { startAfterTime: Date.now() })
		.then(function (rx) {
			platform.notifyReady();	
			platform.log('Azure Event Hub has been initialized.');

			rx.on('errorReceived', function (err) {
				platform.handleException(err);
			}); 
			rx.on('message', function (message) {
				var data = message.body;
				platform.requestDeviceInfo(data.device, function (error, requestId) {						
					platform.once(requestId, function (deviceInfo) {
						if (deviceInfo)
							platform.processData(data.device, JSON.stringify(data));
						else
							platform.handleException(new Error(`Device ${data.device} not registered`));
					});
				});
			});
		});
});