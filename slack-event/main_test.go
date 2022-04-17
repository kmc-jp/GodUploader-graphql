package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

type APIPingResponse struct {
	OK bool `json:"ok"`
}

func TestApiPing(t *testing.T) {
	url := "http://localhost:8080/api/ping"
	req := httptest.NewRequest(http.MethodGet, url, nil)
	res := httptest.NewRecorder()

	handleApiPing(res, req)

	if res.Code != http.StatusOK {
		t.Errorf("want %d, got %d", http.StatusOK, res.Code)
	}

	rawBody := res.Body.Bytes()

	var apiResp APIPingResponse
	err := json.Unmarshal(rawBody, &apiResp)
	if err != nil {
		t.Log(len(rawBody))
		t.Fatal(err)
	}

	if !apiResp.OK {
		t.Fail()
	}
}
