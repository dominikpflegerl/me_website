<?php
	// Import PHPMailer classes into the global namespace
	// These must be at the top of your script, not inside a function
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	$errors = [];
	$receiving_email_address = "contact@pflegerl.dev";

	function processText($input) {
		$input = trim($input);
		$input = nl2br($input);
		$input = htmlspecialchars($input);
		return $input;
	}

	if(!empty($_POST)) {
		require '../vendor/PHPMailer/Exception.php';
		require '../vendor/PHPMailer/OAuth.php';
		require '../vendor/PHPMailer/PHPMailer.php';
		require '../vendor/PHPMailer/SMTP.php';
		
		$name = processText($_POST["name"]);
		$mail = processText($_POST["mail"]);
		$text = processText($_POST["message"]);
			
		if(empty($name)) { $errors[] = 'Name ist leer! '; }
		if(empty($text)) { $errors[] = 'Nachricht ist leer! '; }
		if(empty($mail)) { $errors[] = 'E-Mail Adresse ist leer! '; }	else if(!filter_var($mail, FILTER_VALIDATE_EMAIL)) { $errors[] = "E-Mail Adresse ist ungültig! "; };
		
		if(empty($errors)) { 
			$mail = new PHPMailer(true);
			try {
				//Server settings
				$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
				$mail->isSMTP();                                            // Send using SMTP
				$mail->Host       = 'smtp-relay.sendinblue.com';            // Set the SMTP server to send through
				$mail->SMTPAuth   = true;                                   // Enable SMTP authentication
				$mail->Username   = 'sendinblue.me@neus.xyz';               // SMTP username
				$mail->Password   = 'ZxdtI68ahNfJpcrE';                     // SMTP password
				$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
				$mail->Port       = 587;                                    // TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above
				$mail->CharSet = 'UTF-8';

				//Recipients
				$mail->setFrom($mail, $name);
				$mail->addAddress('contact@pflegerl.dev', 'Dominik Pflegerl');     // Add a recipient, Name is optional
				$mail->addReplyTo($mail, $name);

				// Content
				$mail->isHTML(true);                                  // Set email format to HTML
				$mail->Subject = 'Kontaktanfrage';
				$mail->Body    = $text;
				$mail->AltBody = $text;

				$mail->send();
				echo "Success";
			} catch (Exception $e) {
				die(header("HTTP/1.0 500 Internal Server Error"));
			}
		} else { // else if errors are not empty
			//echo $errors[0];
			foreach ($errors as $key=>$item){ echo $item; }
			die(header('HTTP/1.0 400 Bad Request'));
		}
	} else { // els if post is empty
		die(header('HTTP/1.0 400 Bad Request'));
	}
?>