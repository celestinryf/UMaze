package main

// This will hold the current game state
// Will hold the maze associated with this game.
// Will also hold a hero (to be finished)
type game struct {
	gameMaze *maze
	// has a hero guy
}

// Will return a game struct
// Creates a new maze and hero (to do)
func initGame() *game {

	newGame := &game{
		gameMaze: initMaze(5, 5), // values can be changed later
	}

	return newGame
}
