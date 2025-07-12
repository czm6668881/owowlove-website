# 🚀 生产环境部署清单

## 📋 **修复完成状态**

### ✅ **已修复的问题**
- [x] **Footer链接404错误** - 已重定向到正确页面
- [x] **图片URL格式错误** - 已清理多余字符
- [x] **Next.js配置** - 已添加生产域名支持
- [x] **图片API增强** - 已添加详细调试和错误处理
- [x] **前端错误处理** - 已添加多重备用URL尝试
- [x] **React Key属性** - 已移除不必要的key属性

### 📁 **修改的文件列表**
1. `components/footer.tsx` - Footer链接修复
2. `next.config.mjs` - 生产域名配置
3. `app/[lang]/page.tsx` - 图片URL处理和错误处理
4. `app/api/image/[filename]/route.ts` - 图片API增强
5. `scripts/production-health-check.js` - 生产环境健康检查
6. `scripts/simple-health-check.js` - 简化健康检查
7. `package.json` - 添加健康检查脚本

## 🔧 **部署前检查**

### 1. **代码提交**
```bash
# 检查修改的文件
git status

# 添加所有修改
git add .

# 提交修改
git commit -m "Fix production environment issues: footer links, image API, and error handling"

# 推送到远程仓库
git push origin main
```

### 2. **本地测试**
```bash
# 运行简化健康检查
node scripts/simple-health-check.js

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### 3. **环境变量检查**
确保生产环境有以下环境变量：
- `NODE_ENV=production`
- `PORT=3000` (或其他端口)
- `SUPABASE_URL=your_supabase_url`
- `SUPABASE_ANON_KEY=your_supabase_key`

## 🌍 **生产环境部署**

### 方案A：使用PM2部署
```bash
# 部署到生产环境
npm run deploy

# 检查部署状态
npm run deploy:status

# 查看日志
npm run deploy:logs

# 重启服务（如需要）
npm run deploy:restart
```

### 方案B：手动部署
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 启动生产服务器
npm run start:prod
```

## 🔍 **部署后验证**

### 1. **页面访问测试**
- [ ] 主页加载正常：`https://owowlove.com/en`
- [ ] 产品图片显示正常
- [ ] Footer链接工作正常
- [ ] 无JavaScript错误

### 2. **API测试**
- [ ] 产品API：`https://owowlove.com/api/products`
- [ ] 图片API：`https://owowlove.com/api/image/product-1752080189101.jpeg`
- [ ] 分类API：`https://owowlove.com/api/categories`

### 3. **健康检查**
```bash
# 运行生产环境健康检查
DOMAIN=owowlove.com npm run health-check
```

### 4. **浏览器控制台检查**
- [ ] 无404错误
- [ ] 无JavaScript错误
- [ ] 图片加载成功
- [ ] 网络请求正常

## 🚨 **故障排除**

### 如果图片仍然404：

#### 1. **检查文件权限**
```bash
# 检查uploads目录权限
ls -la public/uploads/
chmod 755 public/uploads/
chmod 644 public/uploads/*.jpg
chmod 644 public/uploads/*.jpeg
```

#### 2. **检查服务器日志**
```bash
# PM2日志
pm2 logs owowlove-production

# 或直接查看日志文件
tail -f logs/error.log
tail -f logs/out.log
```

#### 3. **手动测试API**
```bash
# 测试图片API
curl -I https://owowlove.com/api/image/product-1752080189101.jpeg

# 测试产品API
curl https://owowlove.com/api/products
```

### 如果Footer链接仍然404：

#### 1. **清除缓存**
- 清除CDN缓存（如使用）
- 清除浏览器缓存
- 重启服务器

#### 2. **检查部署**
```bash
# 确认代码已部署
git log --oneline -5

# 检查文件内容
grep -n "shipping-info" components/footer.tsx
```

## 📊 **监控设置**

### 1. **错误监控**
- 设置404错误监控
- 设置JavaScript错误监控
- 设置API响应时间监控

### 2. **性能监控**
- 图片加载时间
- 页面渲染性能
- API响应时间

### 3. **用户体验监控**
- 图片显示成功率
- 页面加载完成率
- 用户交互成功率

## 🎯 **成功标准**

部署成功的标准：
- ✅ 主页正常加载，无404错误
- ✅ 产品图片正确显示
- ✅ Footer链接正常工作
- ✅ 浏览器控制台无错误
- ✅ API响应正常
- ✅ 健康检查通过

## 📞 **紧急联系**

如果部署后仍有问题：
1. **立即回滚**：`git revert HEAD`
2. **检查服务器状态**：`pm2 status`
3. **查看错误日志**：`pm2 logs`
4. **重启服务**：`pm2 restart owowlove-production`

---

**部署优先级：🔴 高**
**预计影响：✅ 修复用户体验问题**
**回滚计划：✅ 已准备**
