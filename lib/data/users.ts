import { writeFile, readFile, existsSync, mkdir } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import bcrypt from 'bcryptjs'
import { User, PublicUser, RegisterRequest, UpdateUserRequest, UserStats } from '@/lib/types/user'

const writeFileAsync = promisify(writeFile)
const readFileAsync = promisify(readFile)
const mkdirAsync = promisify(mkdir)

const DATA_DIR = join(process.cwd(), 'data')
const USERS_FILE = join(DATA_DIR, 'users.json')

// 确保数据目录存在
async function ensureDataDir() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdirAsync(DATA_DIR, { recursive: true })
    }
  } catch (error) {
    console.error('Error creating data directory:', error)
  }
}

// 默认用户数据
const defaultUsers: User[] = []

// 用户缓存
let usersCache: User[] | null = null

// 加载用户数据
export async function loadUsers(): Promise<User[]> {
  try {
    await ensureDataDir()
    
    if (!existsSync(USERS_FILE)) {
      await saveUsers(defaultUsers)
      return defaultUsers
    }
    
    const data = await readFileAsync(USERS_FILE, 'utf-8')
    const users = JSON.parse(data)
    usersCache = users
    return users
  } catch (error) {
    console.error('Error loading users:', error)
    return defaultUsers
  }
}

// 保存用户数据
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await ensureDataDir()
    await writeFileAsync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
    usersCache = users
  } catch (error) {
    console.error('Error saving users:', error)
    throw error
  }
}

// 获取缓存的用户数据
async function getUsers(): Promise<User[]> {
  if (!usersCache) {
    usersCache = await loadUsers()
  }
  return usersCache
}

// 用户服务类
export class UserService {
  // 获取所有用户（管理员用）
  static async getAllUsers(): Promise<PublicUser[]> {
    const users = await getUsers()
    return users.map(user => this.toPublicUser(user))
  }

  // 根据ID获取用户
  static async getUserById(id: string): Promise<User | null> {
    const users = await getUsers()
    return users.find(user => user.id === id) || null
  }

  // 根据邮箱获取用户
  static async getUserByEmail(email: string): Promise<User | null> {
    const users = await getUsers()
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
  }

  // 创建新用户
  static async createUser(userData: RegisterRequest): Promise<User> {
    const users = await getUsers()
    
    // 检查邮箱是否已存在
    const existingUser = await this.getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email already exists')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      addresses: [],
      isActive: true,
      isEmailVerified: false,
      preferences: {
        language: 'en',
        currency: 'USD',
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    users.push(newUser)
    await saveUsers(users)
    
    return newUser
  }

  // 验证用户密码
  static async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email)
    if (!user || !user.isActive) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return null
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date().toISOString()
    user.updatedAt = new Date().toISOString()
    
    const users = await getUsers()
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = user
      await saveUsers(users)
    }

    return user
  }

  // 更新用户信息
  static async updateUser(id: string, updateData: UpdateUserRequest): Promise<User | null> {
    const users = await getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      return null
    }

    const user = users[userIndex]
    
    // 更新用户信息
    if (updateData.firstName !== undefined) user.firstName = updateData.firstName
    if (updateData.lastName !== undefined) user.lastName = updateData.lastName
    if (updateData.phone !== undefined) user.phone = updateData.phone
    if (updateData.dateOfBirth !== undefined) user.dateOfBirth = updateData.dateOfBirth
    if (updateData.gender !== undefined) user.gender = updateData.gender
    if (updateData.preferences) {
      user.preferences = { ...user.preferences, ...updateData.preferences }
    }
    
    user.updatedAt = new Date().toISOString()
    
    users[userIndex] = user
    await saveUsers(users)
    
    return user
  }

  // 修改密码
  static async changePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.getUserById(id)
    if (!user) {
      return false
    }

    // 验证当前密码
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return false
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    
    const users = await getUsers()
    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      users[userIndex].password = hashedNewPassword
      users[userIndex].updatedAt = new Date().toISOString()
      await saveUsers(users)
      return true
    }

    return false
  }

  // 删除用户
  static async deleteUser(id: string): Promise<boolean> {
    const users = await getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      return false
    }

    users.splice(userIndex, 1)
    await saveUsers(users)
    
    return true
  }

  // 获取用户统计信息
  static async getUserStats(): Promise<UserStats> {
    const users = await getUsers()
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.isActive).length,
      newUsersThisMonth: users.filter(user => new Date(user.createdAt) >= thisMonth).length,
      verifiedUsers: users.filter(user => user.isEmailVerified).length,
      totalOrders: users.reduce((sum, user) => sum + user.totalOrders, 0),
      totalRevenue: users.reduce((sum, user) => sum + user.totalSpent, 0)
    }
  }

  // 转换为公开用户信息
  static toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
      totalOrders: user.totalOrders,
      totalSpent: user.totalSpent,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }
  }
}
