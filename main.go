package main

import (
	"github.com/RadientBrain/Detox-Dopamine/pkg/db"
	"github.com/RadientBrain/Detox-Dopamine/pkg/logger"
	"github.com/RadientBrain/Detox-Dopamine/server"
)

func main() {
	logger.Init()
	db.InitMongo()
	server.Init()
}
