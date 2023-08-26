package app

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shaninalex/go-chat/utils"
)

func (app *App) getCurrentUser(c *gin.Context) {

	user, exist := c.Get("user")
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Can't get user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

type AuthPayload struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (app *App) createUser(c *gin.Context) {
	var payload AuthPayload
	err := c.ShouldBindJSON(&payload)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := app.database.CreateUser(payload.Email, payload.Password)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := utils.CreateJWT(user.Id, user.Email)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("token", token, 3600, "/", "localhost", true, true)
	c.JSON(http.StatusOK, gin.H{
		"access_token": token,
	})
}

func (app *App) authUser(c *gin.Context) {
	var payload AuthPayload
	err := c.ShouldBindJSON(&payload)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := app.database.GetUser(payload.Email)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	match, err := utils.ComparePasswordAndHash(payload.Password, user.PasswordHash)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if !match {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Wrong password"})
		return
	}

	token, err := utils.CreateJWT(user.Id, user.Email)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("token", token, 3600, "/", "localhost", true, true)
	c.JSON(http.StatusOK, gin.H{
		"access_token": token,
	})
}

func (app *App) logoutUser(c *gin.Context) {
	c.SetCookie("token", "", 0, "/", "localhost", true, true)
	c.JSON(http.StatusOK, gin.H{"status": true})
}