package main

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

	// now we need to make the maze valid
	// init the start
	// init the end

	return newMaze
}
