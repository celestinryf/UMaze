package model

import (
	"fmt"
	"math/rand"
)

// Room struct and initRoom must be defined elsewhere

// newGrid creates a grid of Rooms from the generated boolean maze
func newGrid() [mazeSize][mazeSize]*Room {
	var modelGrid [mazeSize][mazeSize]bool

	// Fill with walls (false is wall)
	for i := range modelGrid {
		for j := range modelGrid[i] {
			modelGrid[i][j] = false
		}
	}

	// Start maze generation
	setupNewGrid(1, 1, &modelGrid)

	// Convert boolean grid to Room grid
	var grid [mazeSize][mazeSize]*Room
	for i := range modelGrid {
		for j := range modelGrid[i] {
			if modelGrid[i][j] {
				grid[i][j] = initRoom(path)
			} else {
				grid[i][j] = initRoom(wall)
			}
		}
	}
	return grid
}

// setupNewGrid recursively carves out paths in the maze
func setupNewGrid(x, y int, grid *[mazeSize][mazeSize]bool) {
	fmt.Printf("Visiting (%d, %d)\n", x, y)

	// Define possible directions (in steps of 2 to leave walls)
	directions := [][2]int{
		{0, 2},  // right
		{2, 0},  // down
		{0, -2}, // left
		{-2, 0}, // up
	}
	rand.Shuffle(len(directions), func(i, j int) {
		directions[i], directions[j] = directions[j], directions[i]
	})

	// Mark current cell as path
	grid[y][x] = true

	// Try all directions
	for _, dir := range directions {
		newX := x + dir[0]
		newY := y + dir[1]
		if newX > 0 && newX < mazeSize-1 && newY > 0 && newY < mazeSize-1 && !grid[newY][newX] {
			// Knock down wall between current and target cell
			grid[y+dir[1]/2][x+dir[0]/2] = true
			setupNewGrid(newX, newY, grid)
		}
	}
}
