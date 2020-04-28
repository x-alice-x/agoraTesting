<template>
	<div id="app">
		<HelloWorld />
		<canvas id="local_stream"></canvas>
	</div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import AgoraRTC from "agora-rtc-sdk";

export default {
	name: "App",
	components: {
		HelloWorld
	},
	data() {
		return {
			rtc: {
				client: null,
				joined: false,
				published: false,
				localStream: null,
				remoteStreams: [],
				params: {}
			},
			option: {
				appID: process.env.VUE_APP_ID,
				channel: process.env.VUE_APP_CHANNEL,
				uid: null,
				token: process.env.VUE_APP_TOKEN
			}
		};
	},
	mounted() {
		let self = this;
		// Create a client
		this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
		console.log(this.option);

		// Initialize the client
		this.rtc.client.init(
			this.option.appID,
			function() {
				console.log("init success");

				// Join a channel
				self.rtc.client.join(
					self.option.token,
					self.option.channel,
					self.option.uid,
					function(uid) {
						console.log(
							"join channel: " +
								self.option.channel +
								" success, uid: " +
								uid
						);
						self.rtc.params.uid = uid;

						// Create a local stream
						self.rtc.localStream = AgoraRTC.createStream({
							streamID: self.rtc.params.uid,
							audio: true,
							video: true,
							screen: false
						});
						console.log(self.rtc.localStream);

						// Initialize the local stream
						self.rtc.localStream.init(
							function() {
								console.log("init local stream success");
								// play stream with html element id "local_stream"
								self.rtc.localStream.play("local_stream");

								// Publish the local stream
								self.rtc.client.publish(
									self.rtc.localStream,
									function(err) {
										console.log("publish failed");
										console.error(err);
									}
								);
							},
							function(err) {
								console.error("init local stream failed ", err); // device's not found (maybe bc of camera and microphone)
							}
						);
					},
					function(err) {
						console.error("client join failed", err);
					}
				);
			},
			err => {
				console.error(err);
			}
		);
	}
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
canvas {
	width: 500px;
	height: 500px;
}
</style>
