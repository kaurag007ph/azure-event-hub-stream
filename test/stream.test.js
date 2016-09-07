/*
 * Just a sample code to test the stream plugin.
 * Kindly write your own unit tests for your own plugin.
 */
'use strict';

const PORT = 8080;

var cp     = require('child_process'),
	assert = require('assert'),
	stream;

describe('Stream', function () {
	this.slow(5000);

	after('terminate child process', function () {
		stream.kill('SIGKILL');
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			assert.ok(stream = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			stream.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			stream.send({
				type: 'ready',
				data: {
					options: {
						connectionString: 'Endpoint=sb://demo1-azure.servicebus.windows.net/;SharedAccessKeyName=reekoh-stream-plugin;SharedAccessKey=/82TPzsutlEHZX+Prq1MQZq10daL/Hjut/cunLc9M6E=',
						eventName: 'myevent',
						partitionId: '3'
					}
				}
			}, function (error) {
				assert.ifError(error);
			});
		});
	});

	describe('#publish', function() {
        it('should publish event data', function(done) {
            // this.timeout(5000);
  			// var EventHubClient = require('azure-event-hubs').Client;
 
			// var client = EventHubClient.fromConnectionString('Endpoint=sb://demo1-azure.servicebus.windows.net/;SharedAccessKeyName=reekoh-stream-plugin;SharedAccessKey=/82TPzsutlEHZX+Prq1MQZq10daL/Hjut/cunLc9M6E=', 'myevent');
			// client.createSender('3')
			// 	.then(function (tx) {
			// 		tx.on('errorReceived', function (err) { console.log(err); });
			// 		tx.send({ device: 'raspberry', data: 20 }); 
			// 	});	
			done();	
        });
    });
});