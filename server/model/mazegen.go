package model

import "math/rand"

const (
	wallId     = 0
	pathId     = 1
	mazeWidth  = 21
	mazeHeight = 21
)

func newModelMaze() [][]int {
	grid := make([][]int, mazeHeight)
	for y := 0; y < mazeHeight; y++ {
		grid[y] = make([]int, mazeWidth)
		for x := 0; x < mazeWidth; x++ {
			grid[y][x] = wallId // Initially, everything is a wall
		}
	}
	generateModelMaze(1, 1, grid)
	return grid
}

func generateModelMaze(x, y int, grid [][]int) {
	directions := [][2]int{
		{0, 2},  // right
		{2, 0},  // down
		{0, -2}, // left
		{-2, 0}, // up
	}
	rand.Shuffle(len(directions), func(i, j int) {
		directions[i], directions[j] = directions[j], directions[i]
	})
	grid[y][x] = pathId
	for _, dir := range directions {
		newX := x + dir[0]
		newY := y + dir[1]
		if newX > 0 && newX < mazeWidth-1 && newY > 0 && newY < mazeHeight-1 && grid[newY][newX] == wallId {
			grid[newY][newX] = pathId
			grid[y+dir[1]/2][x+dir[0]/2] = pathId
			generateModelMaze(newX, newY, grid)
		}
	}
}
