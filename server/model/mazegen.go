package model

import "math/rand"

// Given an ODD, positive maze size
// Return a Maze Set up with rooms
func newGrid(mazeSize int) [][]*Room {
	modelGrid := make([][]bool, mazeSize)
	for i := range modelGrid {
		modelGrid[i] = make([]bool, mazeSize)
	}
	setupNewGrid(1, 1, mazeSize, modelGrid)
	grid := make([][]*Room, mazeSize)
	for i := range modelGrid {
		grid[i] = make([]*Room, mazeSize)
		for j := range modelGrid[i] {
			if modelGrid[i][j] {
				grid[i][j] = InitRoom(true)
			} else {
				grid[i][j] = InitRoom(false)
			}
		}
	}
	return grid
}

// Sets up a new bool grid recursively into a maze
// Must be passed an all false, odd maze
func setupNewGrid(x, y, mazeSize int, grid [][]bool) {
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
			grid[y+dir[1]/2][x+dir[0]/2] = true
			setupNewGrid(newX, newY, mazeSize, grid)
		}
	}
}
