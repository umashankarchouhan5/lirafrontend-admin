<template>
	<FormWrapper>
        <PageTitle title="PDF Editor" slot="title" /> 

		<FormRow>
			<div class="col-sm-6">
				<InputFile 
					v-if="pdfFile == null"
					@onChange="onUploadHandler " 
					label="Select File"
					:rules="{docCheck: 'pdf', checkFileRegex: true }"
				/>

			</div>
		</FormRow>

		<PSPDFKit
			:pdfFile="pdfFile"
			v-if="pdfFile !== null"
			@loaded="handleLoaded"
		/>
	</FormWrapper>
</template>

<script>
	import FormWrapper from 'Components/form/FormWrapper';
	import PageTitle from 'Components/layout/PageTitle';
	import PSPDFKit from 'Components/pspdfkit.vue';

	export default {
		name: 'PdfViewerComponent',
		data() {
			return {
				pdfFile: null,
			}
		},
		components: {
			PSPDFKit,
			FormWrapper,
			PageTitle
		},
		created() {
		},
		methods: {
			onUploadHandler(file) {
				this.pdfFile = file;
				// var reader = new FileReader();
				// var fileByteArray = [];
				// const self = this;
				// reader.readAsArrayBuffer(file);
				// reader.onloadend = function (evt) {
				// 	if (evt.target.readyState == FileReader.DONE) {
				// 		console.log(evt)
				// 		var arrayBuffer = evt.target.result;
				// 		self.pdfFile = arrayBuffer;
				// 		console.log(fileByteArray)
				// 	}
				// }
			},
			handleLoaded(instance) {
				console.log("PSPDFKit has loaded: ", instance);
				// do something
			},
			openDocument() {
				if (this.pdfFile) {
					window.URL.revokeObjectURL([this.pdfFile]);
				}
				this.pdfFile = window.URL.createObjectURL(event.target.files[0]);
			},
		},
	}
</script>