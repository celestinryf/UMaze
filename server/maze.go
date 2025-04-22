package main

import "math/rand"

// The maze has a 2d array of rooms
// The start is initially the start of the maze, then as
// the user move, the start is what is updated.
// The end is where the final room (where the user escapes)
type maze struct {
	arr   [][]*room
	start *room // (is going to be used the current room)
	end   *room
}

// This will create a maze with rows x cols dimensions
// It will then initialize all the rooms inside of it
// It will also choose a start and the end point of the maze
func initMaze(rows, cols int) *maze {
	newMaze := &maze{
		arr: make([][]*room, rows),
	}

	for i := range rows {
		newMaze.arr[i] = make([]*room, cols)
		for j := range rows {
			newMaze.arr[i][j] = initRoom()
		}
	}

	newMaze.setUpOutsideWalls(rows, cols)
	newMaze.createValidMaze()

	sx, sy, ex, ey := selectStartEnd(rows, cols)
	newMaze.start = newMaze.arr[sx][sy]
	newMaze.end = newMaze.arr[ex][ey]

	return newMaze
}

// Generates values for our start and end room.
func selectStartEnd(rows, cols int) (int, int, int, int) {
	startX := rand.Intn(rows)
	startY := rand.Intn(cols)
	var endX int
	var endY int

	for {
		endX = rand.Intn(rows)
		endY = rand.Intn(cols)
		if startX != endX || startY != endY {
			break
		}
	}
	return startX, startY, endX, endY
}

// Sets all outside walls to false on the outside
func (m *maze) setUpOutsideWalls(rows, cols int) {
	// sets top and bottom walls
	for i := range cols {
		m.arr[0][i].up = false
		m.arr[rows-1][i].down = false
	}
	// sets left and right walls
	for i := range rows {
		m.arr[i][0].left = false
		m.arr[i][cols-1].right = false
	}
}

// Create valid maze using a maze generation algorithm.
// Assumes that the maze is newly initialized.
func (m *maze) createValidMaze() {
	// recursively makes maze
}
