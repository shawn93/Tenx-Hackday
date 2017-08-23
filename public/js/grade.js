
	$(document).ready(function(){
	    $("#flip").click(function(){
	        if ($('#panel').is(':visible')){
	        	$("#panel").slideUp("slow");
	        	document.getElementById("grade").innerHTML="Grade This";
			} else {
				$("#panel").slideDown("slow");
				document.getElementById("grade").innerHTML="Collect It";
			}
	    });
	});

	$(document).on("pagecreate","#container",function(){
	  $("#slide_block").on("swipeleft",function(){
	    alert("You swiped left!");
	  });
	});

	$(document).on("pagecreate","#container",function(){
	  $("#slide_block").on("swiperight",function(){
	    alert("You swiped right!");
	  });
	});

	function displayCre() {
		document.getElementById("creativity").innerHTML = document.getElementById("rangecre").value;
	}

	function displayFun(){
		document.getElementById("functions").innerHTML = document.getElementById("rangefun").value;
	}
	//$.mobile.loading("hide");
	//$.mobile.loading().hide();
	

