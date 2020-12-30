package utils

import (
	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails"
)

// StartWatcher => watches file changes made into the data file
func StartWatcher(runtime *wails.Runtime, logger *wails.CustomLogger, filename string, eventMessage string) error {
	logger.Info("Starting Watcher ... ")

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
					logger.Infof("modified file: %s", event.Name)
					runtime.Events.Emit(eventMessage) // emit datamodified, the frontend will reload after getting this message
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				logger.Error(err.Error())
			}
		}
	}()

	err = watcher.Add(filename)
	if err != nil {
		return err
	}

	return nil
}
