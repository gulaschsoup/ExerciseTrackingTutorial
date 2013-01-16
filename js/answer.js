// Function to check if the answer given is correct and validates if a radio button was selected
// USED by the questions  
function checkAnswers(){

	var radios = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < radios.length; i++) {
    	if (radios[i].type == 'radio' && radios[i].checked) {
	        value = true;       
    	}
	}

	if (value) {
		if (document.getElementById('radio-choice-1').checked) {
			window.location = "question_1.html#solution_correct"
		}
		else {
			window.location = "question_1.html#solution_wrong"
		}
	}
	
	else {
		alert ("Please select one of the possible answers")
		}	 
}


function checkRangeAnswer2(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result == 5400) {
			window.location = "question_2.html#solution_correct"
		}
		
		else if (result < 3501) {
			window.location = "question_2.html#solution_wrong1"
		}
		else if (result >= 3501 && result < 4800) {
			window.location = "question_2.html#solution_wrong2"
		}
		else if (result >= 4800 && result < 5400) {
			window.location = "question_2.html#solution_wrong3"
		}
		else if (result >= 5401 && result < 6000) {
			window.location = "question_2.html#solution_wrong4"
		}
		
		else if (result >= 6000 && result < 7200) {
			window.location = "question_2.html#solution_wrong5"
		}
		
		else  
		{
			window.location = "question_2.html#solution_wrong6"
		}
	}		
	else {
		alert ('Please enter a valid number.')
	}
}

// Ändere das später so, dass Usability besser ist, Ziel ist natürlich nur 2 Funktionen zu haben. Und nicht für jede Frage eine eigene Funktion aufzurufen. 
function checkAnswer3(){

	var radios = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < radios.length; i++) {
    	if (radios[i].type == 'radio' && radios[i].checked) {
	        value = true;       
    	}
	}

	if (value) {
		if (document.getElementById('radio-choice-3').checked) {
			window.location = "question_3.html#solution_correct"
		}
		else {
			window.location = "question_3.html#solution_wrong"
		}
	}
	
	else {
		alert ("Please select one of the possible answers")
		}	 
}

function checkRangeAnswer4(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result >= 311 && result <= 335 ) {
			window.location = "question_4.html#solution_correct"
		}
		
		else if (result < 250) {
			window.location = "question_4.html#solution_wrong1"
		}
		else if (result >= 250 && result < 310) {
			window.location = "question_4.html#solution_wrong2"
		}
		else {
			window.location = "question_4.html#solution_wrong3"
		}
		
	}		
	else {
		alert ('Please enter a valid number.')
	}
}

function checkRangeAnswer5(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result >= 13.75 && result < 14.51 ) {
			window.location = "question_5.html#solution_correct"
		}
		
		else if (result < 13.19) {
			window.location = "question_5.html#solution_wrong1"
		}
		else if (result >= 13.19 && result < 13.75) {
			window.location = "question_5.html#solution_wrong2"
		}
		else if (result >= 14.51 && result < 15.15) {
			window.location = "question_5.html#solution_wrong3"
		}
		else {
			window.location = "question_5.html#solution_wrong4"
		}
		
	}		
	else {
		alert ('Please enter a valid number.')
	}
}

function checkRangeAnswer6(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result >= 10.50 && result < 14 ) {
			window.location = "question_6.html#solution_correct"
		}
		
		else {
			window.location = "question_6.html#solution_wrong1"
		}
		
	}		
	else {
		alert ('Please enter a valid number.')
	}
}

function checkRangeAnswer7(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result >= 8 && result < 8.4 ) {
			window.location = "question_7.html#solution_correct"
		}
		
		else {
			window.location = "question_7.html#solution_wrong1"
		}
		
	}		
	else {
		alert ('Please enter a valid number.')
	}
}

function checkRangeAnswer8(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result >= 50 && result < 60 ) {
			window.location = "question_8.html#solution_correct"
		}
		
		else {
			window.location = "question_8.html#solution_wrong1"
		}
		
	}		
	else {
		alert ('Please enter a valid number.')
	}
}

function checkRangeAnswer9(){
	
	var texts = document.getElementsByTagName('input');
	var value;
	for (var i = 0; i < texts.length; i++) {
    	if (texts[i].type == 'text' && texts[i].value.length != 0) {
	        value = true;       
    	}
	}

	if (value) {
		var result = document.getElementById('answer').value
		if (result >= 41 && result <= 45 ) {
			window.location = "question_9.html#solution_correct"
		}
		
		else {
			window.location = "question_9.html#solution_wrong1"
		}
		
	}		
	else {
		alert ('Please enter a valid number.')
	}
}
