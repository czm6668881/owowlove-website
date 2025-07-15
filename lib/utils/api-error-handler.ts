/**
 * API错误处理工具
 */

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: string
  timestamp?: string
}

export class ApiError extends Error {
  public status: number
  public code?: string
  public details?: string

  constructor(message: string, status: number = 500, code?: string, details?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

/**
 * 安全的fetch包装器，处理网络错误和API错误
 */
export async function safeFetch<T = any>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    console.log(`🔍 API Request: ${options?.method || 'GET'} ${url}`)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    })

    let data: any
    try {
      data = await response.json()
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError)
      return {
        success: false,
        error: 'Invalid response format',
        details: 'Server returned invalid JSON'
      }
    }

    if (!response.ok) {
      console.error(`❌ API Error ${response.status}:`, data)
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        details: data.details || response.statusText
      }
    }

    console.log(`✅ API Success: ${url}`)
    return data
  } catch (error) {
    console.error(`❌ Network Error for ${url}:`, error)
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network connection failed',
        details: 'Please check your internet connection and try again'
      }
    }

    return {
      success: false,
      error: 'Request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * 处理API响应，提供默认值
 */
export function handleApiResponse<T>(
  response: ApiResponse<T>,
  defaultValue: T,
  errorMessage?: string
): T {
  if (response.success && response.data !== undefined) {
    return response.data
  }

  console.warn(`⚠️ API fallback used: ${errorMessage || response.error}`)
  return defaultValue
}

/**
 * 重试机制
 */
export async function retryFetch<T>(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T> | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${url}`)
    
    const result = await safeFetch<T>(url, options)
    
    if (result.success) {
      return result
    }

    lastError = result
    
    if (attempt < maxRetries) {
      console.log(`⏳ Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // 指数退避
    }
  }

  return lastError || {
    success: false,
    error: 'All retry attempts failed'
  }
}

/**
 * 批量API调用
 */
export async function batchFetch<T>(
  requests: Array<{ url: string; options?: RequestInit }>,
  concurrent: boolean = false
): Promise<Array<ApiResponse<T>>> {
  if (concurrent) {
    // 并发执行
    const promises = requests.map(req => safeFetch<T>(req.url, req.options))
    return Promise.all(promises)
  } else {
    // 顺序执行
    const results: Array<ApiResponse<T>> = []
    for (const req of requests) {
      const result = await safeFetch<T>(req.url, req.options)
      results.push(result)
    }
    return results
  }
}
