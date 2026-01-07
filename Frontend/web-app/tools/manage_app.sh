#!/bin/bash

# 获取脚本所在目录和应用根目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
LOG_FILE="$APP_DIR/app.log"
PORT=3000

start() {
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        echo "Error: Port $PORT is already in use."
        exit 1
    fi

    echo "Starting web-app on port $PORT..."
    cd "$APP_DIR"
    
    # 在后台启动应用并记录日志
    nohup npm run dev -- --port $PORT > "$LOG_FILE" 2>&1 &
    
    echo "Web-app is starting. You can check logs at: $LOG_FILE"
    echo "URL: http://localhost:$PORT"
}

stop() {
    echo "Stopping web-app on port $PORT..."
    # 查找占用指定端口的进程并杀死它
    PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        kill $PID
        echo "Web-app (PID $PID) stopped."
    else
        echo "No process found running on port $PORT."
    fi
}

status() {
    PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        echo "Web-app is running on port $PORT (PID: $PID)"
    else
        echo "Web-app is not running."
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        sleep 2
        start
        ;;
    status)
        status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
esac
