package main

import (
	"log"
	"path"

	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

// WailsInit => runtime events
func (c *Collections) WailsInit(runtime *wails.Runtime) error {
	c.runtime = runtime
	c.logger = c.runtime.Log.New("Collections")

	// get the user's homedir path
	homedir, err := runtime.FileSystem.HomeDir()
	if err != nil {
		return err
	}

	// set data path and default db file
	c.datapath = path.Join(homedir, ZETADATADIR)
	c.filename = path.Join(c.datapath, DEFAULTCOLLECTIONSLIST)

	// check folder and data file
	c.ensureFileFolder()

	// return the watcher
	return c.startWatcher()
}

// APP is based from tutorial: https://wails.app/tutorials/todo/
func main() {

	js := mewn.String("./frontend/build/static/js/main.js")
	css := mewn.String("./frontend/build/static/css/main.css")

	newCols, err := NewCollections()
	if err != nil {
		log.Fatal(err)
	}

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1000,
		Height: 600,
		Title:  "Zeta | Simple Desktop APP for Managing Collections",
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})
	app.Bind(newCols)
	app.Run()
}
