<?php

/*date_default_timezone_set('America/Los_Angeles');

if(!isset($_FILES["fileupload"]) || $_FILES["fileupload"]["error"] > 0){
	echo "ha ocurrido un error";
}else{
	$permitidos = array("image/jpg", "image/jpeg", "image/gif", "image/png");
	$limite_kb = 16384;
	echo $imagen = $_FILES['fileupload']['type'];
    $tipo = explode("/",$imagen);
    $fecha=new DateTime();
    $Nombre = $fecha->format('YmdHis').".".$tipo[1];

	//$Nombre = "imagePerfil".$tipo

	if (in_array($_FILES['fileupload']['type'], $permitidos) && $_FILES['fileupload']['size'] <= $limite_kb * 1024){

		$imagen_temporal  = $_FILES['fileupload']['tmp_name'];
		$tipo = $_FILES['fileupload']['type'];
		
		if(move_uploaded_file($_FILES['fileupload']['tmp_name'],$Nombre)){
			echo $Nombre;
		}else {
			echo "error";
		}
	} else {
		echo "no_permitido";
	}
}*/

if(!isset($_FILES["file"]) || $_FILES["file"]["error"] > 0){
	echo "ha ocurrido un error";
}else{
	echo $imagen = $_FILES['file']['type'];
}

?>