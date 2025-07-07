module.exports = {
  apps: [
    {
      name: 'owowlove-production',
      script: 'start-server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'node',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0'
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 自动重启配置
      watch: false, // 生产环境不建议开启文件监控
      ignore_watch: ['node_modules', 'logs', '.git'],
      max_memory_restart: '1G',
      
      // 进程管理
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      
      // 健康检查
      health_check_grace_period: 3000,
      
      // 其他配置
      merge_logs: true,
      time: true
    }
  ],

  // 部署配置（可选）
  deploy: {
    production: {
      user: 'node',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:username/owowlove.git',
      path: '/var/www/owowlove',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
