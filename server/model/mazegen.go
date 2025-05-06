package model

import "math/rand"

// Makes a new Grid
func newGrid() [mazeSize][mazeSize]*room {
	var modelGrid [mazeSize][mazeSize]bool
	setupNewGrid(1, 1, modelGrid) // can be random
	var grid [mazeSize][mazeSize]*room
	for i := range modelGrid {
		for j := range modelGrid[0] {
			if modelGrid[i][j] == true {
				grid[i][j] = initRoom(path)
			} else {
				grid[i][j] = initRoom(wall)
			}
		}
	}
	return grid
}

// Recursively generages a maze with true and false values
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
