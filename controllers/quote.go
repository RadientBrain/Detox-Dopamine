package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
)

type ApiParams struct {
	ApiKey string `json:"api-key"`
}

func Generate(c *gin.Context) {
	var params ApiParams
	if err := c.ShouldBindJSON(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	apiKey := params.ApiKey
	if apiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "missing OPENAI_API_KEY environment variable"})
	}

	client := openai.NewClient(apiKey)
	req := openai.CompletionRequest{
		Model:     openai.GPT3Ada,
		MaxTokens: 10,
		Prompt:    "Generate a new motivational quote",
	}
	resp, err := client.CreateCompletion(c, req)
	if err != nil {
		fmt.Printf("Completion error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// fmt.Println(resp.Choices[0].Text)

	c.JSON(http.StatusOK, gin.H{"message": resp.Choices[0].Text})
	// c.JSON(http.StatusOK, gin.H{"message": "Be motivated always!!!"})
}
