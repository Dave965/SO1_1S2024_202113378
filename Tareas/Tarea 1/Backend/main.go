package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type estudiante struct{
	Carnet string `json:"carnet"`
	Nombre string `json:"nombre"`
	Posicion string `json:"posicion"`
	Github string `json:"github"`
	Linkedin string `json:"linkedin"`
}

var yo = estudiante{
	Carnet: "202113378",
	Nombre: "David Abraham Noriega Zamora",
	Posicion: "FullStack Dev",
	Github: "https://github.com/Dave965",
	Linkedin: "https://www.linkedin.com/in/david-noriega-61bba5222/",
}

func getEstudiante(context *gin.Context){
	context.IndentedJSON(http.StatusOK, yo)
}

func main(){
	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200)
			return
		}

		c.Next()
	})

	router.GET("/data", getEstudiante)

	router.Run("0.0.0.0:8080")
}