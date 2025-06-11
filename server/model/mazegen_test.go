package model

import "testing"

// Tests the set up new grid method
// Perim must be walls
// No unaccasable areas
// logs the maze
func TestSetupNewGridThirteen(t *testing.T) {

	mazeSize := 13

	modelGrid := make([][]bool, mazeSize)
	for i := range modelGrid {
		modelGrid[i] = make([]bool, mazeSize)
	}
	setupNewGrid(1, 1, mazeSize, modelGrid)

	for i := range mazeSize {
		if modelGrid[i][0] || modelGrid[i][mazeSize-1] ||
			modelGrid[0][i] || modelGrid[mazeSize-1][i] {
			t.Error("Perim should only have walls")
		}
	}

	for i := 1; i < mazeSize-1; i++ {
		for j := 1; j < mazeSize-1; j++ {
			if modelGrid[i][j] &&
				!modelGrid[i-1][j] && !modelGrid[i+1][j] &&
				!modelGrid[i][j-1] && !modelGrid[i][j+1] {
				t.Error("Walled off path")
			}
		}
	}

	if len(modelGrid) != mazeSize {
		t.Error("Altered Size")
	}

	for _, row := range modelGrid {
		if len(row) != mazeSize {
			t.Error("Altered Size")
		}
	}

	for _, row := range modelGrid {
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
func TestSetupNewGridEleven(t *testing.T) {

	mazeSize := 11

	modelGrid := make([][]bool, mazeSize)
	for i := range modelGrid {
		modelGrid[i] = make([]bool, mazeSize)
	}
	setupNewGrid(1, 1, mazeSize, modelGrid)

	for i := range mazeSize {
		if modelGrid[i][0] || modelGrid[i][mazeSize-1] ||
			modelGrid[0][i] || modelGrid[mazeSize-1][i] {
			t.Error("Perim should only have walls")
		}
	}

	for i := 1; i < mazeSize-1; i++ {
		for j := 1; j < mazeSize-1; j++ {
			if modelGrid[i][j] &&
				!modelGrid[i-1][j] && !modelGrid[i+1][j] &&
				!modelGrid[i][j-1] && !modelGrid[i][j+1] {
				t.Error("Walled off path")
			}
		}
	}

	if len(modelGrid) != mazeSize {
		t.Error("Altered Size")
	}

	for _, row := range modelGrid {
		if len(row) != mazeSize {
			t.Error("Altered Size")
		}
	}

	for _, row := range modelGrid {
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
func TestNewGridThirteen(t *testing.T) {

	mazeSize := 13

	grid := newGrid(mazeSize)

	for i := range mazeSize {
		if grid[i][0].RoomType == "Path" ||
			grid[i][mazeSize-1].RoomType == "Path" ||
			grid[0][i].RoomType == "Path" ||
			grid[mazeSize-1][i].RoomType == "Path" {
			t.Error("Perim should only have walls")
		}
	}

	for i := 1; i < mazeSize-1; i++ {
		for j := 1; j < mazeSize-1; j++ {
			if grid[i][j].RoomType == "Path" &&
				grid[i-1][j].RoomType == "Wall" &&
				grid[i+1][j].RoomType == "Wall" &&
				grid[i][j-1].RoomType == "Wall" &&
				grid[i][j+1].RoomType == "Wall" {
				t.Error("Walled off path")
			}
		}
	}

	if len(grid) != mazeSize {
		t.Error("Maze wrong size")
	}

	for _, row := range grid {
		if len(row) != mazeSize {
			t.Error("Maze Wrong Size")
		}
	}

	for _, row := range grid {
		var line string
		for _, currRoom := range row {
			if currRoom.RoomType == "Path" {
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

	for i := range mazeSize {
		if grid[i][0].RoomType == "Path" ||
			grid[i][mazeSize-1].RoomType == "Path" ||
			grid[0][i].RoomType == "Path" ||
			grid[mazeSize-1][i].RoomType == "Path" {
			t.Error("Perim should only have walls")
		}
	}

	for i := 1; i < mazeSize-1; i++ {
		for j := 1; j < mazeSize-1; j++ {
			if grid[i][j].RoomType == "Path" &&
				grid[i-1][j].RoomType == "Wall" &&
				grid[i+1][j].RoomType == "Wall" &&
				grid[i][j-1].RoomType == "Wall" &&
				grid[i][j+1].RoomType == "Wall" {
				t.Error("Walled off path")
			}
		}
	}

	if len(grid) != mazeSize {
		t.Error("Maze wrong size")
	}

	for _, row := range grid {
		if len(row) != mazeSize {
			t.Error("Maze Wrong Size")
		}
	}

	for _, row := range grid {
		var line string
		for _, currRoom := range row {
			if currRoom.RoomType == "Path" {
				line += "+"
			} else {
				line += "-"
			}
		}
		t.Log(line)
	}

}
