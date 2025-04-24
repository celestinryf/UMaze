package area

import "fmt"

type room struct {
	isExplored, isExit, pit bool
	pillar, potion, monster int // adjust to the actual objects
}

func initRoom() *room {
	return &room{
		isExplored: false,
		isExit:     false,
		pit:        false,
	}
}

func (r *room) canPass() bool {
	return true
}

// make a setMonster(m *Monster)
// make a setPotion(p *Potion)
// make a set pillar (p *Pillar)
// make a set pit
// make a set exit
// makea a set explored

func (r room) String() string {
	explored, exit, pit := 0, 0, 0
	if r.isExplored {
		explored = 1
	}
	if r.isExit {
		exit = 1
	}
	if r.pit {
		pit = 1
	}
	// fix this later to add the potions and stuff
	return fmt.Sprintf("%d%d%d\n*R*\n%d%d%d",
		explored, exit, pit,
		r.pillar, r.potion, r.monster)
}
