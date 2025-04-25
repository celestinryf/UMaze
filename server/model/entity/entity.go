package entity

type entity interface {
	getName() string
	attack() int         // gets the attack stat of the monter (subtract from opps hp)
	takeDamage(int) bool // subtracts damge and returns if they are alive
	getHP() int
}
