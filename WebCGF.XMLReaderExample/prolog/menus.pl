:- include('game.pl').

% Main menu options
menu_option('1'):-  start_game(1, _).

menu_option('2'):-  bot_difficulty(2). 
menu_option('3'):-  bot_difficulty(3).

menu_option('4'):-  write('/////////////\n'),
    				write('//  Rules  //\n'),
    				write('/////////////\n\n'),
    				write('Players alternate playing adjacent to the existing pattern.\nThe first player to form a four tile triangle with his color on all three tips (and either color in the center) wins.\n'),
	    			write('\nInsert key any to go back\n'),	
		    		readAnyKey,
                    spangles.

menu_option(OPTION):-   OPTION \= '1',
                        OPTION \= '2',
                        OPTION \= '3',
                        OPTION \= '4',
                        spangles.

% Choose the bot difficulty
bot_difficulty(TYPE) :-    clearConsole,
                write('/////////////////////////\n'),
                write('//   Bot Difficulty    //\n'),
                write('//                     //\n'),
                write('// Choose an option:   //\n'),
                write('//  1-Random           //\n'),
                write('//  2-Smart            //\n'),
                write('/////////////////////////\n'),
                prompt(_, 'Difficulty: '),
                get_char(DIFFICULTY_CHAR),
                get_char(_),
                name(DIFFICULTY_CHAR, [DIFFICULTY_INT_CHAR]),
                DIFFICULTY is DIFFICULTY_INT_CHAR - 48,
                prompt(_, ''),
                DIFFICULTY > 0,
                DIFFICULTY < 3, 
                start_game(TYPE, DIFFICULTY).
bot_difficulty(TYPE) :- write('Invalid bot difficulty... Press any key to try again'), nl,
                readAnyKey, !,
                bot_difficulty(TYPE).

% Start the game
start_game(1, _) :- readBoardSize(COLUMNS, ROWS),
                    startPvP(COLUMNS, ROWS).
start_game(2, DIFFICULTY) :-    readBoardSize(COLUMNS, ROWS),
                                startPvB(COLUMNS, ROWS, DIFFICULTY).
start_game(3, DIFFICULTY) :-    readBoardSize(COLUMNS, ROWS),
                                startBvB(COLUMNS, ROWS, DIFFICULTY).

% Main menu
spangles :- write('//////////////////////////\n'),
    		write('//        Spangles      //\n'),
    		write('//                      //\n'),
    		write('// Choose an option:    //\n'),
    		write('//  1-Player vs Player  //\n'),
    		write('//  2-Player vs Bot     //\n'),
    		write('//  3-Bot vs Bot        //\n'),
    		write('//  4-Rules             //\n'),
    		write('//                      //\n'),
            write('//////////////////////////\n'),
            prompt(_, 'Option: '),
    		get_char(OPTION),
            get_char(_),
            prompt(_, ''),
    		menu_option(OPTION).
