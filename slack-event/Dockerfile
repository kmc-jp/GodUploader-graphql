FROM golang:1.17 AS builder

WORKDIR /app
COPY ./main.go ./
RUN go build -o ./slack-event-handler

FROM alpine:3.15.4
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /app/slack-event-handler ./

CMD ["./slack-event-handler"]
