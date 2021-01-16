!(function($) {
  //"use strict";
	
	var textarea = $("textarea");

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	function showErrorMsg(area, errorMsg) {
		$('#div-' + area + ' small').html("<i class='bx bx-error mr-1 my-0 py-0'></i>" + errorMsg);
		$('#div-' + area + ' small').css("background-color", "darkred");
		$('#div-' + area + ' small').css("color", "white");
		$('#div-' + area + ' small').css("display", "block");
		$('#div-' + area + ' input').css("border-color", "darkred");	
		$('#div-' + area + ' textarea').css("border-color", "darkred");	// only relevant for the message box, but doesn't heart ya'know
	}
	
	function hideErrorMsg(area) {
		$('#div-' + area + ' small').css("background-color", "transparent");
		$('#div-' + area + ' small').css("color", "transparent");
		$('#div-' + area + ' input').css("border-color", "");	
		$('#div-' + area + ' textarea').css("border-color", "");	// only relevant for the message box, but doesn't heart ya'know
	}
		
	function showButton(typ) {
		$("#button").css("background-color", "");
		$("#button-default").hide();
		$("#button-loading").hide();
		$("#button-success").hide();
		$("#button-error").hide();
		switch(typ) {
			case "default":
				$("#button-default").show();
				break;
			case "loading":
				$("#button-loading").show();
				break;
			case "success":
				$("#button-success").show();
				$("#button").css("background-color", "darkgreen");
				break;
			case "error":
				$("#button-error").show();
				$("#button").css("background-color", "darkred");
				break;
		}
	}
	
	function disableInput(state) {
		$('#div-name input').prop("disabled", state);
		$('#div-mail input').prop("disabled", state);
		$('#div-message textarea').prop("disabled", state);
	}	
	
	// remove validation warning after keychage 
	$("#div-name input").on("change keyup paste", function() {
		showButton("default");
		hideErrorMsg("name");
	});			
	// remove validation warning after keychage 
	$("#div-mail input").on("change keyup paste", function() {
		showButton("default");
		hideErrorMsg("mail");
	});			
	// remove validation warning after keychage 
	$("#div-message textarea").on("change keyup paste", function() {
		showButton("default");
		hideErrorMsg("message");
	});		
	
	function validateForm() {
		//showErrorMsg("name", "Bitte einen Namen eingeben!");
		//showErrorMsg("mail", "Bitte eine gültige E-Mail Adresse eingeben!");
		//showErrorMsg("message", "Bitte eine Nachricht eingeben!");
		return true;
	}
		
	function submitForm(){
		sleep(2000).then(() => { 
			$.ajax({
				type: "POST",
				url: "/assets/php/contact.php",
				cache: false,
				data: $('form#contact-form').serialize(),
				success: function(){
					console.log("Form submitted successfully");
					showButton("success");
					$("#contact-form").trigger("reset"); // resets the form after sending the mail successfully
				},
				error: function(result){
					console.log('Form Error: ' + result.responseText);
					showButton("error");
				}
			});
			disableInput(false);
		});
	}
	
	
	
	
	$(document).ready(function(){	
		$("#contact-form").submit(function(){
			if(validateForm()) {
				disableInput(true);
				showButton("loading");
				sleep(2000).then(() => { 
					showButton("success");
					//submitForm();
				});
			} else {
				showButton("error");
			}
		});
	});
	
		
	//var textarea = document.getElementById("div-message textarea");
	//var limitRows = 32;
	//var messageLastScrollHeight = textarea.scrollHeight;
	//
	//textarea.oninput = function() {
	//		var rows = parseInt(textarea.getAttribute("rows"));
	//		// If we don't decrease the amount of rows, the scrollHeight would show the scrollHeight for all the rows
	//		// even if there is no text.
	//		textarea.setAttribute("rows", "7");
	//		
	//		if (rows < limitRows && textarea.scrollHeight > messageLastScrollHeight) {
	//				rows++;
	//		} else if (rows > 1 && textarea.scrollHeight < messageLastScrollHeight) {
	//				rows--;
	//		}
	//		
	//		messageLastScrollHeight = textarea.scrollHeight;
	//		textarea.setAttribute("rows", rows);
	//};
	
})(jQuery);