package maze

type area interface {
	canPass() bool
}

type wall struct{}

func (w *wall) canPass() bool {
	return false
}

func initWall() *wall {
	return &wall{}
}

type room struct {
	isExplored bool
	isExit     bool
	//pillar     oopillar
	//potion     potion
	//monster    monster
}

func (r *room) canPass() bool {
	return true
}

func initRoom() *room {
	return &room{
		isExplored: false,
		isExit:     false,
	}
}
