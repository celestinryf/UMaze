package model

import "testing"

// Tests the set up new grid method
// Perim must be walls
// No unaccasable areas
// logs the maze
func TestSetupNewGrid(t *testing.T) {
	var modelGrid [mazeSize][mazeSize]bool
	for i := range modelGrid {
		for j := range modelGrid {
			modelGrid[i][j] = false
		}
	}

	setupNewGrid(1, 1, &modelGrid)

	for i := range mazeSize {
		// check left wall
		if modelGrid[i][0] {
			t.Error("Perim should only have walls")
		}
		// check right wall
		if modelGrid[i][mazeSize-1] {
			t.Error("Perim should only have walls")
		}
		// check top wall
		if modelGrid[0][i] {
			t.Error("Perim should only have walls")
		}
		// check bottom wall
		if modelGrid[mazeSize-1][i] {
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
