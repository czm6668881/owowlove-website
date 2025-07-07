# OWOWLOVE.COM Vercel部署指南

## 🚀 快速部署步骤

### 1. 准备工作
- ✅ 代码已提交到Git仓库
- ✅ 已创建Vercel配置文件
- ✅ 已优化Next.js配置

### 2. 创建Vercel账户
1. 访问 https://vercel.com/
2. 使用GitHub账户登录（推荐）
3. 授权Vercel访问您的GitHub仓库

### 3. 部署项目

#### 方法一：通过GitHub连接（推荐）
1. 将代码推送到GitHub仓库
2. 在Vercel Dashboard点击"New Project"
3. 选择您的GitHub仓库
4. 配置项目设置：
   - **Project Name**: `owowlove`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### 方法二：使用Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel --prod
```

### 4. 环境变量配置
在Vercel Dashboard的项目设置中添加以下环境变量：

```
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
ADMIN_PASSWORD=owowlove2025
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
NEXT_PUBLIC_SITE_NAME=OWOWLOVE
NEXT_PUBLIC_SITE_DESCRIPTION=Premium Sexy Cosplay Costumes for Women and Girls
NEXT_PUBLIC_SITE_KEYWORDS=sexy cosplay,women,girl,animal,costume,bunny
NEXT_PUBLIC_CONTACT_EMAIL=admin@owowlove.com
```

### 5. 域名配置（可选）
1. 在Vercel Dashboard进入项目设置
2. 点击"Domains"标签
3. 添加自定义域名 `owowlove.com`
4. 按照指示配置DNS记录

### 6. 部署后验证
- ✅ 网站首页正常加载
- ✅ 类目导航显示正确
- ✅ 产品页面功能正常
- ✅ 管理员登录功能正常
- ✅ 用户注册/登录功能正常
- ✅ 图片上传功能正常

## 📋 重要配置文件

### vercel.json
- 配置构建和路由规则
- 设置API函数超时时间
- 静态文件服务配置

### next.config.mjs
- Vercel优化配置
- 图片域名白名单
- 文件重写规则

### .env.example
- 环境变量模板
- 生产环境配置示例

## 🔧 故障排除

### 常见问题
1. **构建失败**: 检查TypeScript错误和依赖版本
2. **图片不显示**: 验证图片路径和域名配置
3. **API错误**: 检查环境变量和函数超时设置
4. **认证问题**: 确认JWT_SECRET和ADMIN_PASSWORD设置

### 调试方法
- 查看Vercel构建日志
- 使用浏览器开发者工具
- 检查Vercel函数日志

## 🌐 访问地址
部署成功后，您的网站将在以下地址可用：
- **Vercel域名**: https://your-app-name.vercel.app
- **自定义域名**: https://owowlove.com（配置后）

## 📞 技术支持
如遇到部署问题，请检查：
1. Vercel官方文档
2. Next.js部署指南
3. 项目GitHub Issues
