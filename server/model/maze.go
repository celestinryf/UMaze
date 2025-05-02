package model

import "math/rand/v2"

const mazeSize = 21

type maze struct {
	grid [mazeSize][mazeSize]bool
}

func initMaze() *maze {
	newMaze := maze{
		grid: newGrid(),
	}
	// make the start and the end
	return &newMaze
}

func newGrid() [mazeSize][mazeSize]bool {
	var grid [mazeSize][mazeSize]bool
	setupNewGrid(1, 1, grid) // can be random

	return grid
}

func setupNewGrid(x, y int, grid [mazeSize][mazeSize]bool) {
	directions := [][2]int{
		{0, 2},
		{2, 0},
		{0, -2},
		{-2, 0},
	}
	rand.Shuffle(len(directions), func(i, j int) {
		directions[i], directions[j] = directions[j], directions[i]
	})
	grid[y][x] = true
	for _, dir := range directions {
		newX := x + dir[0]
		newY := y + dir[1]
		if newX > 0 && newX < mazeSize-1 && newY > 0 && newY < mazeSize-1 && !grid[newY][newX] {
			grid[newY][newX] = true
			grid[y+dir[1]/2][x+dir[0]/2] = true
			setupNewGrid(newX, newY, grid)
		}
	}
}
