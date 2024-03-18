package main

import (

	"net/http"
	"os/exec"
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"strconv"
)

var process *exec.Cmd

type pidReq struct {
	Pid int `json:"pid"`
}

func getDatos(context *gin.Context){
	out, _ := exec.Command("cat","/proc/p1_202113378").Output()
	context.IndentedJSON(http.StatusOK, string(out))
}

func StartProcess(context *gin.Context){
	cmd := exec.Command("sleep", "infinity")
	cmd.Start()
	process = cmd
	var res pidReq
	res.Pid = process.Process.Pid
	context.IndentedJSON(http.StatusOK, res)
}

func StopProcess(context *gin.Context) {
	var req pidReq
	context.BindJSON(&req)
	cmd := exec.Command("kill", "-SIGSTOP", strconv.Itoa(req.Pid))
	err:=cmd.Run()
	if err != nil{
		context.IndentedJSON(http.StatusOK, err)
		return
	}
	context.IndentedJSON(http.StatusOK, "Proceso detenido")
}

func ResumeProcess(context *gin.Context) {
	var req pidReq
	context.BindJSON(&req)
	cmd := exec.Command("kill", "-SIGCONT", strconv.Itoa(req.Pid))
	err:=cmd.Run()
	if err != nil{
		context.IndentedJSON(http.StatusOK, err)
		return
	}
	context.IndentedJSON(http.StatusOK, "Proceso comenzado")
}

func KillProcess(context *gin.Context) {
	var req pidReq
	context.BindJSON(&req)
	cmd := exec.Command("kill", "-9", strconv.Itoa(req.Pid))
	err:=cmd.Run()
	if err != nil{
		context.IndentedJSON(http.StatusOK, err)
		return
	}
	context.IndentedJSON(http.StatusOK, "Proceso terminado")
}


func main(){
	 db, err := sql.Open("mysql", "root:123@tcp(db:3306)/historicos")
    if err != nil {
        panic(err.Error())
    }
    defer db.Close()
    
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

	router.GET("/data", getDatos)
	router.GET("/iniciarP", StartProcess)
	router.POST("/pararP", StopProcess)
	router.POST("/continuarP", ResumeProcess)
	router.POST("/terminarP", KillProcess)

	router.Run("0.0.0.0:80")
}
