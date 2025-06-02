package model

// Tests the set up new grid method
// Perim must be walls
// No unaccasable areas
// logs the maze
// func TestSetupNewGrid(t *testing.T) {
// 	var modelGrid [mazeSize][mazeSize]bool
// 	for i := range modelGrid {
// 		for j := range modelGrid {
// 			modelGrid[i][j] = false
// 		}
// 	}

// 	setupNewGrid(1, 1, &modelGrid)

// 	for i := range mazeSize {
// 		if modelGrid[i][0] || modelGrid[i][mazeSize-1] ||
// 			modelGrid[0][i] || modelGrid[mazeSize-1][i] {
// 			t.Error("Perim should only have walls")
// 		}
// 	}

// 	for i := 1; i < mazeSize-1; i++ {
// 		for j := 1; j < mazeSize-1; j++ {
// 			if modelGrid[i][j] &&
// 				!modelGrid[i-1][j] && !modelGrid[i+1][j] &&
// 				!modelGrid[i][j-1] && !modelGrid[i][j+1] {
// 				t.Error("Walled off path")
// 			}
// 		}
// 	}

// 	for _, row := range modelGrid {
// 		var line string
// 		for _, val := range row {
// 			if val {
// 				line += "+"
// 			} else {
// 				line += "-"
// 			}
// 		}
// 		t.Log(line)
// 	}
// }

// // test the new grid function
// func TestNewGrid(t *testing.T) {

// 	grid := newGrid()

// 	for i := range mazeSize {
// 		if grid[i][0].RoomType == path ||
// 			grid[i][mazeSize-1].RoomType == path ||
// 			grid[0][i].RoomType == path ||
// 			grid[mazeSize-1][i].RoomType == path {
// 			t.Error("Perim should only have walls")
// 		}
// 	}

// 	for i := 1; i < mazeSize-1; i++ {
// 		for j := 1; j < mazeSize-1; j++ {
// 			if grid[i][j].RoomType == path &&
// 				grid[i-1][j].RoomType == wall &&
// 				grid[i+1][j].RoomType == wall &&
// 				grid[i][j-1].RoomType == wall &&
// 				grid[i][j+1].RoomType == wall {
// 				t.Error("Walled off path")
// 			}
// 		}
// 	}

// 	for _, row := range grid {
// 		var line string
// 		for _, currRoom := range row {
// 			if currRoom.RoomType == path {
// 				line += "+"
// 			} else {
// 				line += "-"
// 			}
// 		}
// 		t.Log(line)
// 	}

// }
