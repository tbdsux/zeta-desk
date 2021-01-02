package main

import (
	"log"
	"path"

	"github.com/TheBoringDude/zeta-desk/utils"
	"github.com/leaanthony/mewn"
	"github.com/wailsapp/wails"
)

// WailsInit => runtime events for Items
// it doesn't start watching the data files onLoad
func (i *Items) WailsInit(runtime *wails.Runtime) error {
	i.runtime = runtime

	return nil
}

// WailsInit => runtime events for Collections
// it loads the main data file onLoad
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
	utils.EnsureFileFolder(c.datapath, c.filename)

	// return the watcher
	return c.StartWatcher()
}

// APP is based from tutorial: https://wails.app/tutorials/todo/
func main() {

	js := mewn.String("./frontend/build/static/js/main.js")
	css := mewn.String("./frontend/build/static/css/main.css")

	newCols, err := NewCollections()
	if err != nil {
		log.Fatal(err)
	}
	colItems, err := NewItemsCollections()
	if err != nil {
		log.Fatal(err)
	}

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1100,
		Height: 590,
		Title:  "Zeta | Simple Desktop APP for Managing Collections",
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})
	app.Bind(newCols)
	app.Bind(colItems)
	app.Run()
}
