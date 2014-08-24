var current_word = '';
var current_word_index = 0;
var previous_user_input;
var score = 0;

var review_characters = [];
var number_of_retries = 5;

var letter_to_most_common_word_map = [];

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
		shuffle_array( most_common_words );
		generate_letter_to_most_common_word_map();
		generate_word();
	}
);

function generate_word()
{
	if ( review_characters.length > 0 ) {
		generate_next_review_word();
	} else {
		generate_next_most_common_word();
	}
	$('#generated-output').html( current_word );
}

function generate_next_most_common_word()
{
	current_word_index++;
	if ( current_word_index >= most_common_words.length ) {
		current_word_index = 0;
	}
	current_word = most_common_words[ current_word_index ];
}

function generate_next_review_word()
{
	var current_review_character_code = review_characters.shift();
	var random_index_from_letter_to_most_common_word_map =
		Math.floor(
			Math.random()
				* letter_to_most_common_word_map[ current_review_character_code ].length
		);
	var random_most_common_word_index
		= letter_to_most_common_word_map[ current_review_character_code ][ random_index_from_letter_to_most_common_word_map ];
	current_word = most_common_words[ random_most_common_word_index ];
}

function user_input_keyup( keyup_event )
{
	hide_instructions();
	hide_options();
	if ( keyup_event.keyCode == 13 ) {
		reveal_answer();
		add_review_character();
		score--;
		update_score();
	} else {
		hide_answer();
		check_user_input();
	}
}

function reveal_answer()
{
	var user_input_length = $('#user-input').val().length;
	$('#answer').html( 'Answer: ' + current_word[ user_input_length ] );
}

function hide_answer()
{
	$('#answer').html( '' );
}

function add_review_character()
{
	var user_input_length = $('#user-input').val().length;
	if ( user_input_length >= current_word.length ) {
		return;
	}
	var review_character_code = current_word.charCodeAt( user_input_length );
	for ( var i = 0; i < number_of_retries; i++ ) {
		review_characters.push( review_character_code );
	}
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
			add_review_character();
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

function generate_letter_to_most_common_word_map()
{
	for ( var word_index = 0; word_index < most_common_words.length; word_index++ ) {
		for ( var char_index = 0; char_index < most_common_words[ word_index ].length; char_index++ ) {
			var current_letter = most_common_words[ word_index ][ char_index ];
			var current_character_code = most_common_words[ word_index ].charCodeAt( char_index );
			if ( ! letter_to_most_common_word_map[ current_character_code ] ) {
				letter_to_most_common_word_map[ current_character_code ] = [];
			}
			letter_to_most_common_word_map[ current_character_code ].push( word_index );
		}
	}
}

function shuffle_array( array )
{
	var current_index = array.length;
	var temporary_value;
	var random_index;

	while ( 0 !== current_index ) {

		random_index = Math.floor( Math.random() * current_index );
		current_index -= 1;

		temporary_value = array[ current_index ];
		array[ current_index ] = array[ random_index ];
		array[ random_index ] = temporary_value;

	}

	return array;
}
