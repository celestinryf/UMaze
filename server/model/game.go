package model

import "github.com/celestinryf/go-backend/model/maze"

type game struct {
	gameMaze *maze.Maze
	// has a hero guy
}

// should control the game
// prints the current room over and over again (based on curr loaction)
// give options, (move, use a potion, attack)
// ends when the user wins
// at the conclusion display entire dungeon
// choose a hero method
// save and load game (allow user to save by the name) (serialization)

func initGame() *game {

	newGame := &game{
		gameMaze: maze.InitMaze(),
	}

	return newGame
}
