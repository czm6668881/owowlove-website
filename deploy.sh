#!/bin/bash

# OWOWLOVE.COM Production Deployment Script for Linux/Unix
# Bash script to deploy the application to production

PROJECT_NAME="owowlove-production"
LOG_DIR="logs"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 创建日志目录
create_log_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        echo -e "${GREEN}Created logs directory${NC}"
    fi
}

# 检查PM2是否安装
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}PM2 not found. Installing PM2...${NC}"
        npm install -g pm2
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to install PM2${NC}"
            exit 1
        fi
    fi
}

# 构建应用
build_app() {
    echo -e "${BLUE}Building application for production...${NC}"
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Build completed successfully!${NC}"
    else
        echo -e "${RED}Build failed!${NC}"
        exit 1
    fi
}

# 启动应用
start_app() {
    echo -e "${BLUE}Starting application...${NC}"
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "${GREEN}Application started!${NC}"
}

# 停止应用
stop_app() {
    echo -e "${BLUE}Stopping application...${NC}"
    pm2 stop $PROJECT_NAME
    echo -e "${GREEN}Application stopped!${NC}"
}

# 重启应用
restart_app() {
    echo -e "${BLUE}Restarting application...${NC}"
    pm2 restart $PROJECT_NAME
    echo -e "${GREEN}Application restarted!${NC}"
}

# 查看状态
show_status() {
    echo -e "${BLUE}Application status:${NC}"
    pm2 status
}

# 查看日志
show_logs() {
    echo -e "${BLUE}Showing application logs...${NC}"
    pm2 logs $PROJECT_NAME --lines 50
}

# 显示帮助
show_help() {
    echo -e "${CYAN}OWOWLOVE.COM Production Deployment Script${NC}"
    echo ""
    echo "Usage:"
    echo "  ./deploy.sh build          Build the application"
    echo "  ./deploy.sh start          Start the application"
    echo "  ./deploy.sh stop           Stop the application"
    echo "  ./deploy.sh restart        Restart the application"
    echo "  ./deploy.sh status         Show application status"
    echo "  ./deploy.sh logs           Show application logs"
    echo "  ./deploy.sh deploy         Full deployment (build + start)"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh deploy         Full deployment"
    echo "  ./deploy.sh restart        Restart the running application"
}

# 完整部署
full_deploy() {
    create_log_dir
    check_pm2
    build_app
    
    # 检查应用是否已经在运行
    if pm2 list | grep -q $PROJECT_NAME; then
        restart_app
    else
        start_app
    fi
}

# 主逻辑
create_log_dir
check_pm2

case "$1" in
    build)
        build_app
        ;;
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        restart_app
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    deploy)
        full_deploy
        ;;
    *)
        show_help
        ;;
esac
