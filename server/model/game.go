package model

import "github.com/celestinryf/go-backend/model/maze"

type game struct {
	gameMaze *maze.Maze
	// has a hero guy
}

func initGame() *game {

	newGame := &game{
		gameMaze: maze.InitMaze(),
	}

	return newGame
}
