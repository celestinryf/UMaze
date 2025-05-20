package model

import (
	"database/sql"
	"math/rand"
)

// maze has dimensions of mazeSize * mazeSize
const mazeSize = 7

// Holds the grid of the maze.
type Maze struct {
	Grid [mazeSize][mazeSize]*Room `json:"Grid"`
}

// inits the maze struct and returns a pointer to a maze
func initMaze(db *sql.DB) *Maze {

	newMaze := Maze{
		Grid: newGrid(),
	}

	validRooms := make([]*Room, 0)
	for i := range newMaze.Grid {
		for j := range newMaze.Grid[0] {
			if newMaze.Grid[i][j].RoomType == path {
				validRooms = append(validRooms, newMaze.Grid[i][j])
			}
		}
	}

	room_list := []RoomTypes{start, end}
	for _, roomType := range room_list {
		randInt := rand.Intn(len(validRooms) - 1)
		validRooms[randInt].RoomType = roomType
		validRooms = removeElement(validRooms, randInt)
	}

	pillar_list := []Pillar{pillar1, pillar2, pillar3, pillar4}
	for _, pillar := range pillar_list {
		randInt := rand.Intn(len(validRooms) - 1)
		validRooms[randInt].PillarType = pillar
		validRooms = removeElement(validRooms, randInt)
	}

	for _, room := range validRooms {
		room.setUpRoom(db)
	}

	return &newMaze
}

// Helper method to remove element from a slice
func removeElement(slice []*Room, index int) []*Room {
	return append(slice[:index], slice[index+1:]...)
}
