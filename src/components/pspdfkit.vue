<template>
	<div>
		<div id="container" style="height: 100vh; width: 90vw;"></div>
		<!-- <FormButton @click="save()" >Save</FormButton> -->
	</div>
</template>
<script>

import PSPDFKit from 'pspdfkit';

// Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
const baseUrl = `${window.location.protocol}//${window.location.host}/`;

/**
 * PSPDFKit for Web example component
 */
export default {
	name: 'PSPDFKit',
	/**
	 * The component receives these parameters:
	 * @documentUrl: string — URL of the document to be loaded.
	 * @baseUrl: string — URL from which the PSPDFKit library should get its payload and artifacts
	 */
	
	props: {
		pdfFile: {
			type: [File, Object, Blob],
			required: true,
		},
	},
	_instance: null,

	data() {
		return {
			storeData: null,
			instance: null,
			dataInBase64: null
		}
	},
	/**
	* We wait until the template has been rendered to load the document into the library.
	*/
	mounted: function mounted() {
		this.load();

		let instance = this;
		const downloadButton = {
			type: "custom",
			id: "download-pdf",
			title: "Download",
			onPress: () => {
				instance.exportPDF().then((buffer) => {
					const blob = new Blob([buffer], { type: "application/pdf" });
					const fileName = "document.pdf";
					if (window.navigator.msSaveOrOpenBlob) {
						window.navigator.msSaveOrOpenBlob(blob, fileName);
					} else {
						const objectUrl = URL.createObjectURL(blob);
						const a = document.createElement("a");
						a.href = objectUrl;
						a.style = "display: none";
						a.download = fileName;
						document.body.appendChild(a);
						a.click();
						URL.revokeObjectURL(objectUrl);
						document.body.removeChild(a);
					}
				});
			}
		};

	},
	/**
	 * Our component has these two methods — one to trigger document loading, and the other to unload and clean up
	 * so the component is ready to load another document.
	 */
	methods: {
    			// disableWebAssemblyStreaming: true,
		
		load: function load() {
			const self = this;
			const documentBlobObjectUrl = URL.createObjectURL(self.pdfFile);
			PSPDFKit.load({
				baseUrl: baseUrl,
				document: documentBlobObjectUrl,
				container: "#container",
			}).then( (instance => {	
				URL.revokeObjectURL(documentBlobObjectUrl);
				self.instance = instance;

				self.instance.exportPDF().then((buffer) => {
					var binary = '';
					var bytes = new Uint8Array( buffer );
					var len = bytes.byteLength;
					for (var i = 0; i < len; i++) {
						binary += String.fromCharCode( bytes[ i ] );
					}
					self.dataInBase64 = window.btoa( binary );
				})


				// instance.addEventListener("document.saveStateChange", (event) => {
				// 	console.log(event)
				// 	console.log(`Save state changed: ${event.hasUnsavedChanges}`);
				// });
				instance.addEventListener("annotations.willChange", event => {
					console.log(event)
					if (event.reason === PSPDFKit.AnnotationsWillChangeReason.DRAW_START) {
						console.log("The user is drawing...");
					}
					self.save();
				});
			}));

				// PSPDFKit.load({ autoSaveMode: PSPDFKit.AutoSaveMode.INTELLIGENT });
		},
		unload: function unload() {
			if (this._instance) {
				PSPDFKit.unload(this._instance || "#container");
				this._instance = null;
			}
		},
		save() {
			console.log(this.instance)
			this.instance.exportPDF().then((buffer) => {
				const blob = new Blob([buffer], { type: "application/pdf" });
				var binary = '';
				var bytes = new Uint8Array( buffer );
				var len = bytes.byteLength;
				for (var i = 0; i < len; i++) {
					binary += String.fromCharCode( bytes[ i ] );
				}
				this.dataInBase64 = window.btoa( binary );
				console.log(this.dataInBase64)
				// console.log(window.btoa( binary ));
				// const fileName = "document.pdf";
				// if (window.navigator.msSaveOrOpenBlob) {
				// 	window.navigator.msSaveOrOpenBlob(blob, fileName);
				// } else {
				// 	const objectUrl = URL.createObjectURL(blob);
				// 	console.log(objectUrl)
				// 	const a = document.createElement("a");
				// 	a.href = objectUrl;
				// 	a.style = "display: none";
				// 	a.download = fileName;
				// 	document.body.appendChild(a);
				// 	a.click();
				// 	URL.revokeObjectURL(objectUrl);
				// 	document.body.removeChild(a);
				// }
			});
			
		}
	},
	/**
	 * We watch for `documentUrl` prop changes and trigger unloading and loading when there's a new document to load.
	 */
	watch: {
		pdfFile: function pdfFile() {
			// this.unload();
			// this.load();
		}
	},
	/**
	 * Clean up when the component is unmounted (not needed in this example).
	 */
	beforeDestroy: function beforeDestroy() {
		this.unload();
	}
}
</script>
