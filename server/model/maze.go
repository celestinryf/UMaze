package model

import (
	"database/sql"
	"math/rand"
)

// maze has dimensions of mazeSize * mazeSize
const mazeSize = 7

// Holds the grid of the maze.
type Maze struct {
	Grid [mazeSize][mazeSize]*Room `json:"grid"`
}

// inits the maze struct and returns a pointer to a maze
func initMaze(db *sql.DB) *Maze {

	newMaze := Maze{
		Grid: newGrid(),
	}

	// set up valid rooms
	validRooms := make([]*Room, 0)
	for i := range newMaze.Grid {
		for j := range newMaze.Grid[0] {
			if newMaze.Grid[i][j].RoomType == path {
				validRooms = append(validRooms, newMaze.Grid[i][j])
			}
		}
	}

	// make a starting room
	randInt := rand.Intn(len(validRooms) - 1)
	validRooms[randInt].RoomType = start
	validRooms = removeElement(validRooms, randInt)
	// make an ending room
	randInt = rand.Intn(len(validRooms) - 1)
	validRooms[randInt].RoomType = end
	validRooms = removeElement(validRooms, randInt)

	// set up pillars
	pillar_list := []Pillar{pillar1, pillar2, pillar3, pillar4}
	for _, pillar := range pillar_list {
		randInt = rand.Intn(len(validRooms) - 1)
		validRooms[randInt].PillarType = pillar
		validRooms = removeElement(validRooms, randInt)
	}

	// sets up potions, monsters, and pits
	for _, val := range validRooms {
		val.setUpRoom(db)
	}

	return &newMaze
}

func removeElement(slice []*Room, index int) []*Room {
	return append(slice[:index], slice[index+1:]...)
}
