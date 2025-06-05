package model

import "testing"

// Tests the set up new grid method
// Perim must be walls
// No unaccasable areas
// logs the maze
func TestSetupNewGridEleven(t *testing.T) {

	// one maze size
	mazeSizeA := 11
	grid := make([][]bool, mazeSizeA)
	for i := range grid {
		grid[i] = make([]bool, mazeSizeA)
	}
	setupNewGrid(1, 1, mazeSizeA, grid)
	if len(grid) != mazeSizeA || len(grid[0]) != mazeSizeA {
		t.Error("Maze not the right size")
	}
	for i := range grid {
		if grid[i][0] || grid[0][i] ||
			grid[i][mazeSizeA-1] || grid[mazeSizeA-1][i] {
			t.Error("Perimeter should only have walls")
		}
	}
	for i := 1; i < mazeSizeA-1; i++ {
		for j := 1; j < mazeSizeA-1; j++ {
			if grid[i][j] &&
				!grid[i-1][j] && !grid[i+1][j] &&
				!grid[i][j-1] && !grid[i][j+1] {
				t.Error("Walled off path")
			}
		}
	}
	for _, row := range grid {
		var line string
		for _, val := range row {
			if val {
				line += "+"
			} else {
				line += "-"
			}
		}
		t.Log(line)
	}
}

// Tests the set up new grid method
// Perim must be walls
// No unaccasable areas
// logs the maze
func TestSetupNewGridThirteen(t *testing.T) {
	mazeSizeA := 13
	grid := make([][]bool, mazeSizeA)
	for i := range grid {
		grid[i] = make([]bool, mazeSizeA)
	}
	setupNewGrid(1, 1, mazeSizeA, grid)
	if len(grid) != mazeSizeA || len(grid[0]) != mazeSizeA {
		t.Error("Maze not the right size")
	}
	for i := range grid {
		if grid[i][0] || grid[0][i] ||
			grid[i][mazeSizeA-1] || grid[mazeSizeA-1][i] {
			t.Error("Perimeter should only have walls")
		}
	}
	for i := 1; i < mazeSizeA-1; i++ {
		for j := 1; j < mazeSizeA-1; j++ {
			if grid[i][j] &&
				!grid[i-1][j] && !grid[i+1][j] &&
				!grid[i][j-1] && !grid[i][j+1] {
				t.Error("Walled off path")
			}
		}
	}
	for _, row := range grid {
		var line string
		for _, val := range row {
			if val {
				line += "+"
			} else {
				line += "-"
			}
		}
		t.Log(line)
	}
}

// test the new grid function
func TestNewGridEleven(t *testing.T) {
	mazeSize := 11
	grid := newGrid(mazeSize)
	if len(grid) != mazeSize || len(grid[0]) != mazeSize {
		t.Error("Not right size")
	}
	for i := range grid {
		if grid[i][0].RoomType == path ||
			grid[i][mazeSize-1].RoomType == path ||
			grid[0][i].RoomType == path ||
			grid[mazeSize-1][i].RoomType == path {
			t.Error("Perim should only have walls")
		}
	}
	for i := 1; i < mazeSize-1; i++ {
		for j := 1; j < mazeSize-1; j++ {
			if grid[i][j].RoomType == path &&
				grid[i-1][j].RoomType == wall &&
				grid[i+1][j].RoomType == wall &&
				grid[i][j-1].RoomType == wall &&
				grid[i][j+1].RoomType == wall {
				t.Error("Walled off path")
			}
		}
	}
	for _, row := range grid {
		var line string
		for _, currRoom := range row {
			if currRoom.RoomType == path {
				line += "+"
			} else {
				line += "-"
			}
		}
		t.Log(line)
	}
}

// test the new grid function
func TestNewGridThirteen(t *testing.T) {
	mazeSize := 13
	grid := newGrid(mazeSize)
	if len(grid) != mazeSize || len(grid[0]) != mazeSize {
		t.Error("Not right size")
	}
	for i := range grid {
		if grid[i][0].RoomType == path ||
			grid[i][mazeSize-1].RoomType == path ||
			grid[0][i].RoomType == path ||
			grid[mazeSize-1][i].RoomType == path {
			t.Error("Perim should only have walls")
		}
	}
	for i := 1; i < mazeSize-1; i++ {
		for j := 1; j < mazeSize-1; j++ {
			if grid[i][j].RoomType == path &&
				grid[i-1][j].RoomType == wall &&
				grid[i+1][j].RoomType == wall &&
				grid[i][j-1].RoomType == wall &&
				grid[i][j+1].RoomType == wall {
				t.Error("Walled off path")
			}
		}
	}
	for _, row := range grid {
		var line string
		for _, currRoom := range row {
			if currRoom.RoomType == path {
				line += "+"
			} else {
				line += "-"
			}
		}
		t.Log(line)
	}
}
