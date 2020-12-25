package main

import (
	"io/ioutil"
	"os"

	"github.com/fsnotify/fsnotify"
)

// ensureFileFolder => check if the default file exists in the data dir
func (c *Collections) ensureFileFolder() {
	// Check status of data folder
	if _, err := os.Stat(c.datapath); os.IsNotExist(err) {
		// make the directory
		os.MkdirAll(c.datapath, 0755)
	}

	// check status of file
	if _, err := os.Stat(c.filename); os.IsNotExist(err) {
		// Create it with a blank list
		ioutil.WriteFile(c.filename, []byte("[]"), 0600)
	}
}

// startWatcher => watches file changes made into the data file
func (c *Collections) startWatcher() error {
	c.logger.Info("Starting Watcher ... ")

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return err
	}

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				if event.Op&fsnotify.Write == fsnotify.Write {
					c.logger.Infof("modified file: %s", event.Name)
					c.runtime.Events.Emit("datamodified") // emit datamodified, the frontend will reload after getting this message
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				c.logger.Error(err.Error())
			}
		}
	}()

	err = watcher.Add(c.filename)
	if err != nil {
		return err
	}

	return nil
}
