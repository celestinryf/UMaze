package area

import "testing"

// Tests the Wall's implementation of canPass()
func TestWallCanPass(t *testing.T) {
	w := initWall()
	expected := false
	if w.canPass() != expected {
		t.Errorf("expected:\n%v\ngot:%v", expected, w.canPass())
	}
}

// Tests the Wall's implementation of String()
func TestWallString(t *testing.T) {
	w := initWall()
	expected := "***\n*W*\n***"
	if w.String() != expected {
		t.Errorf("expected:\n%s\ngot:%s", expected, w.String())
	}
}
