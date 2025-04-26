package entity

// each hero must have diff health
// own constructro
// healing ability, one attacks twice, more damage

type hero interface {
	entity
	// getters and setters
	// have a defense and attack stat
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
