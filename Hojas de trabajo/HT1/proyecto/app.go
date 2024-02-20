package main

import (
	"context"
	"fmt"
	"os/exec"
	"log"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name

func (a *App) RamLibre() string {
	out, err := exec.Command("cat","/proc/ram_202113378").Output()
	if err != nil{
		log.Fatal(err)
	}
	return fmt.Sprintf("%s", out)
}
