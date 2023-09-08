FROM golang:1.21

WORKDIR /app
ENV GOOS=linux
ENV GOARCH=amd64
COPY ./go.mod ./go.sum ./
RUN go mod download

COPY ./main.go ./
RUN go build -o ./slack-event-handler

CMD ["/app/slack-event-handler"]
