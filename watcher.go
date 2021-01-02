package main

import (
	"github.com/fsnotify/fsnotify"
)

// StartWatcher (collections) => watches file changes made into the data file
func (c *Collections) StartWatcher() error {
	c.logger.Info("Starting Watcher ... ")

	watcher, err := fsnotify.NewWatcher()
	c.watcher = watcher
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

	err = c.watcher.Add(c.filename)
	if err != nil {
		return err
	}

	return nil
}

// StartWatcher (items) => watches file changes made into the data file
func (i *Items) StartWatcher() error {
	i.logger.Info("Starting Watcher ... ")

	watcher, err := fsnotify.NewWatcher()
	i.watcher = watcher
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
					i.logger.Infof("modified file: %s", event.Name)
					i.runtime.Events.Emit("items_modified") // emit items_modified, the frontend will reload after getting this message
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				i.logger.Error(err.Error())
			}
		}
	}()

	err = i.watcher.Add(i.datafile)
	if err != nil {
		return err
	}

	return nil
}
