package model

import (
	"errors"
	"math/rand"
)

// Return a Maze Set up with rooms
func newGrid(mazeSize int) ([][]*Room, error) {
	modelGrid, err := setupNewGrid(mazeSize)
	if err != nil {
		return nil, err
	}

	grid := make([][]*Room, mazeSize)
	for i := range modelGrid {
		grid[i] = make([]*Room, mazeSize)
		for j := range modelGrid[i] {
			grid[i][j] = InitRoom(modelGrid[i][j])
		}
	}
	return grid, nil
}

// Sets up a new bool grid recursively into a maze
func setupNewGrid(mazeSize int) ([][]bool, error) {

	if mazeSize%2 == 0 || mazeSize < 5 {
		return nil, errors.New("invalid maze size")
	}

	grid := make([][]bool, mazeSize)
	for i := range grid {
		grid[i] = make([]bool, mazeSize)
	}

	directions := [][2]int{
		{0, 2},
		{2, 0},
		{0, -2},
		{-2, 0},
	}

	var helper func(x, y int)

	helper = func(x, y int) {
		rand.Shuffle(len(directions), func(i, j int) {
			directions[i], directions[j] = directions[j], directions[i]
		})
		grid[y][x] = true
		for _, dir := range directions {
			newX := x + dir[0]
			newY := y + dir[1]
			if newX > 0 && newX < mazeSize-1 && newY > 0 && newY < mazeSize-1 && !grid[newY][newX] {
				grid[y+dir[1]/2][x+dir[0]/2] = true
				helper(newX, newY)
			}
		}
	}

	helper(1, 1)

	return grid, nil
}
