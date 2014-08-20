var current_word = '';
var previous_user_input;
var score = 0;

$(document).ready(
	function() {
		$('#user-input').focus();
		$('#user-input').keyup(user_input_keyup);
		$('#show-instructions-button').click(show_instructions);
		$('#show-options-button').click(show_options);
		$('#font-size').click(update_font_size);
		show_instructions();
		show_options();
		update_font_size();
		generate_word();
	}
);

function generate_word()
{
	if ( most_common_words.length == 0 ) {
		alert( 'You have traversed 2000 words. That is all for this tutorial. Well done!' );
		$('#user-input').attr( 'disabled', 'true' );
		return;
	}
	current_word = most_common_words.shift();
	$('#generated-output').html( current_word );
}

function user_input_keyup( keyup_event )
{
	hide_instructions();
	hide_options();
	if ( keyup_event.keyCode == 13 ) {
		reveal_answer();
	} else {
		hide_answer();
		check_user_input();
	}
}

function reveal_answer()
{
	var user_input_length = $('#user-input').val().length;
	$('#answer').html( 'Answer: ' + current_word[ user_input_length ] );
	score--;
	update_score();
}

function hide_answer()
{
	$('#answer').html( '' );
}

function check_user_input()
{
	var user_input = $('#user-input').val();
	if ( user_input == previous_user_input ) {
		return;
	} else {
		previous_user_input = user_input;
	}
	var correct_user_input = '';
	for ( i = 0; i < user_input.length; i++ ) {

		if ( user_input[ i ] != current_word[ i ] ) {

			$('#user-input').val( correct_user_input );
			flash_screen();
			score--;

		} else if ( user_input.length == current_word.length ) {
		
			generate_word();
			$('#user-input').val('');
			score++;
			break;

		} else {

			correct_user_input += user_input[ i ];
			if ( i == user_input.length - 1 ) {
				score++;
			}

		}

	}
	update_score();
}

function flash_screen()
{
	$('body').css('background-color', '#AAAAAA');
	setTimeout("$('body').css('background-color', '#FFFFFF');", 100);
}

function update_score()
{
	$('#score').html( score );
}

function hide_instructions()
{
	$('#instructions').hide();
	$('#show-instructions').show();
	$('#user-input').focus();
}

function show_instructions()
{
	$('#show-instructions').hide();
	$('#instructions').show();
	$('#user-input').focus();
}

function show_options()
{
	$('#show-options').hide();
	$('#options').show();
	$('#user-input').focus();
}

function hide_options()
{
	$('#options').hide();
	$('#show-options').show();
	$('#user-input').focus();
}

function update_font_size()
{
	var new_font_size = $('input[name=font_size]:checked').val() + '%';
	$('#generated-output').css( 'font-size', new_font_size );
}
