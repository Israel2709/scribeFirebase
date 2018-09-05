// Get a reference to the storage service, which is used to create references in your storage bucket
var storage = firebase.storage();

// Create a storage reference from our storage service
var storageRef = storage.ref();

// Create a child reference
var imagesRef = storageRef.child('images');
// imagesRef now points to 'images'

var database = firebase.database();
/*db reference*/

// Child references can also take paths delimited by '/'
// spaceRef now points to "images/space.jpg"
// imagesRef still points to "images"

var currentCollection;
var filesArray = [];

const getCollectionPreview = (inputFile) => {
    $('#image-preview')[0].src = (window.URL ? URL : webkitURL).createObjectURL(inputFile.files[0]);
}

const getNotebookPreview = (inputFile) => {
    let currentFiles = inputFile.files;
    if (filesArray.length == 0) {
        $.each(currentFiles, function(key, value) {
            value.previewUrl = (window.URL ? URL : webkitURL).createObjectURL(value)
			filesArray.push(value)
        })
        console.log(filesArray)
    } else {
    	$.each(currentFiles,function(key,value){
    		let exist = false
			$.map(filesArray, function(val) {
			    if(val.name == value.name ){
			    	console.log("exist")
			    	exist = true
			    }
			});
			if(!exist){
				value.previewUrl = (window.URL ? URL : webkitURL).createObjectURL(value)
				filesArray.push(value)
			}
    	})
    }
    console.log(filesArray)
    $(".previews-wrapper .row").empty()
    $.each(filesArray,function(key,value){
    	console.log(value)
    	$(".previews-wrapper .row").append(`
			<div class="col notebook-wrapper">
				<div class="card">
				  <img class="card-img-top" src="${value.previewUrl}" alt="Card image cap">
				  <div class="card-body">
				    <div class="form-group">
				    	<label for="">Nombre</label>
				    	<input type="text" class="form-control notebook-name"></div>
				  </div>
				</div>
			</div>
		`)
    })
  
}

const saveCollection = (newCollection) => {
	let collectionId = firebase.database().ref('collections/').push(newCollection).key;
	console.log(collectionId)
	return collectionId
}

const saveNotebook = (newNotebook) => {
	let notebookId = firebase.database().ref('notebooks/').push(newNotebook).key;
	console.log(notebookId)
	return notebookId;
}

const addNotebookToCollection = (collectionId,notebookId)=>{
	firebase.database().ref('collections/'+collectionId+'/notebooks').push(notebookId);
}

const uploadCollection = ()=>{
	let collectionImg = $("#collection-img").prop("files")[0];
	let imageRefName = storageRef.child(collectionImg.name);
	let imagesRefName = storageRef.child('collectionCovers/'+collectionImg.name);
	let uploadTask = imagesRefName.put(collectionImg)
	uploadTask.on('state_changed',(snapshot)=>{
		let progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
		console.log('upload is '+progress+'% done');
	},(error)=>{
		console.log(error)
	},() => {
		uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
			console.log(downloadURL);
			let collectionName = $("#collection-name").val();
			let collectionCover = downloadURL
			let collectionNotebooks = [];
			let collectionObject = {name:collectionName,coverUrl:collectionCover,notebooks:collectionNotebooks}
			let collectionId = saveCollection(collectionObject)
			console.log("collection ID "+collectionId)
			currentCollection = collectionId;
			console.log("current collection "+currentCollection)
			$(".notebook-wrapper").each(function(index){
				uploadNotebook(currentCollection,this,index)
			})
			//uploadNotebook(currentCollection)
		})
	})
	/*$(".notebook-name").each(function(current){
		console.log(current)
		console.log($(this).val())
	})*/
}

const uploadNotebook = (collectionId,currentWrapper,wrapperIndex)=>{
	console.log(currentWrapper)
	console.log(wrapperIndex)
	let notebookName = $(currentWrapper).find(".notebook-name").val()
	let notebookImg = $("#notebook-img").prop("files")[wrapperIndex];
	let imageRefName = storageRef.child(notebookImg.name);
	let imagesRefName = storageRef.child('notebooksCovers/'+notebookImg.name);
	let uploadTask = imagesRefName.put(notebookImg)
	uploadTask.on('state_changed',(snapshot)=>{
		let progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
		console.log('upload is '+progress+'% done');
	},(error)=>{
		console.log(error)
	},() => {
		uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
			console.log(downloadURL);
			//let notebookName = $("#notebook-name").val();
			let notebookCover = downloadURL
			let notebookObject = {name:notebookName,coverSource:notebookCover}
			let notebookId = saveNotebook(notebookObject);
			addNotebookToCollection(collectionId,notebookId)
		})
	})
}
/*
var submitForm = ()=>{
	let productImg = $("#product-img").prop("files")[0];
	let imageRefName = storageRef.child(productImg.name);
	let imagesRefName = storageRef.child('productImages/'+productImg.name);
	let uploadTask = imagesRefName.put(productImg)
	uploadTask.on('state_changed',(snapshot)=>{
		let progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
		console.log('upload is '+progress+'% done');
	},(error)=>{
		console.log(error)
	},() => {
		uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
			console.log("uploading collecition")
			let productName = $("#product-name").val();
			let productDescription = $("#product-description").val();
			let productPrice = $("#product-price").val();
			let productObject = {productName, productDescription, productPrice, downloadURL}
			console.log(productObject)
			saveProduct(productObject)
		})
	})
}
*/


