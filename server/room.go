package main

// This will be a room that
// has 4 walls surrounding it
// It can also hold potions and monster(to implement)
type room struct {
	up    bool
	right bool
	down  bool
	left  bool
}

// Inits a new room
// Sets every wall to open initially
// Also can put potion or monster in as well (to implement)
func initRoom() *room {
	newRoom := &room{
		up:    true,
		right: true,
		down:  true,
		left:  true,
	}
	return newRoom
}
