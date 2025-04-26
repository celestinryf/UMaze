package entity

// later on, these should be gotten from a database
// the struct will hold a type, will fetch them
// return random when it is inited
const (
	monsterHp      = 100
	monsterAttack  = 25
	monsterDefence = 10
	monsterName    = "Generic Monster"
)

type monster struct {
	currHp int
}

func initMonster() *monster {
	return &monster{currHp: monsterHp}
}

func (m *monster) getName() string {
	return monsterName
}

func (m *monster) attack() int {
	return monsterAttack
}

func (m *monster) takeDamage(damageTaken int) bool {
	m.currHp -= damageTaken
	return m.currHp > 0
}

func (m *monster) getHp() int {
	return m.currHp
}
