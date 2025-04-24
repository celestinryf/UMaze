package entity

type entity interface {
	getName() string
	attack() int         // gets the attack stat of the monter (subtract from opps hp)
	takeDamage(int) bool // subtracts damge and returns if they are alive
	//get hp`
	// attack
	// defense
	// getters and setters
}

type hero interface {
	entity
	// toString w/ (name, hp, total hp, potions, pillar pieces)
	// maybe make this an abstract class that can be extended // or make one
	// will contain a bag of type items (pillars of oop and potions)
	// add a constructor
	// must implement special skill
}

type hero1 struct {
	// maybe has a bigger hit
	// has different health and stuff
	// must have its own constructor -- goes for others
}

type hero2 struct {
	// maybe has a healing ability
}

type hero3 struct {
	// has ability to attack twice in the same turn
}

type monster struct {
	entity
	// each monster type will have diff stats
	// will hold enum of monster, stats depend on what is passed thru
	// constructor
	// get and setterss
}
