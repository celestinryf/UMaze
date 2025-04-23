package model

type area interface{}

type room struct {
	canPass  bool
	explored bool
	// can have also hold potions and whatnot
}

func initRoom(initPass bool) *room {
	newRoom := &room{
		canPass:  initPass,
		explored: false,
	}
	return newRoom
}
