import crypto from 'crypto'
import { 
  PaymentProvider, 
  CreatePaymentRequest, 
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse,
  WechatConfig,
  WechatPaymentData
} from '@/lib/types/payment'

export class WechatProvider implements PaymentProvider {
  name = 'wechat'
  private config: WechatConfig

  constructor(config: WechatConfig) {
    this.config = config
  }

  async createPayment(request: CreatePaymentRequest & { transaction_id?: string }): Promise<CreatePaymentResponse> {
    try {
      const outTradeNo = request.transaction_id || `ORDER_${Date.now()}`
      const nonceStr = this.generateNonceStr()
      
      // Prepare payment parameters
      const params: WechatPaymentData = {
        appid: this.config.app_id,
        mch_id: this.config.mch_id,
        nonce_str: nonceStr,
        sign: '', // Will be set after generating
        body: `订单支付 - ${outTradeNo}`,
        out_trade_no: outTradeNo,
        total_fee: Math.round(request.amount * 100), // Convert to cents
        spbill_create_ip: '127.0.0.1', // Should be actual client IP
        notify_url: this.config.notify_url,
        trade_type: 'NATIVE' // QR code payment
      }

      // Generate signature
      params.sign = this.generateSign(params)

      // Convert to XML
      const xmlData = this.buildXML(params)

      // Make API request
      const response = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml'
        },
        body: xmlData
      })

      const responseText = await response.text()
      const result = this.parseXML(responseText)

      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        return {
          success: true,
          transaction_id: outTradeNo,
          qr_code_url: result.code_url,
          payment_data: {
            prepay_id: result.prepay_id,
            code_url: result.code_url,
            out_trade_no: outTradeNo
          }
        }
      } else {
        return {
          success: false,
          error: result.err_code_des || result.return_msg || 'Payment creation failed'
        }
      }
    } catch (error) {
      console.error('WeChat createPayment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      }
    }
  }

  async verifyPayment(transaction_id: string): Promise<PaymentStatusResponse> {
    try {
      const nonceStr = this.generateNonceStr()
      
      // Prepare query parameters
      const params = {
        appid: this.config.app_id,
        mch_id: this.config.mch_id,
        out_trade_no: transaction_id,
        nonce_str: nonceStr,
        sign: ''
      }

      // Generate signature
      params.sign = this.generateSign(params)

      // Convert to XML
      const xmlData = this.buildXML(params)

      // Make API request
      const response = await fetch('https://api.mch.weixin.qq.com/pay/orderquery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml'
        },
        body: xmlData
      })

      const responseText = await response.text()
      const result = this.parseXML(responseText)

      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        const tradeState = result.trade_state
        let status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'

        switch (tradeState) {
          case 'SUCCESS':
            status = 'completed'
            break
          case 'NOTPAY':
            status = 'pending'
            break
          case 'CLOSED':
          case 'REVOKED':
            status = 'cancelled'
            break
          case 'PAYERROR':
            status = 'failed'
            break
          case 'REFUND':
            status = 'refunded'
            break
          default:
            status = 'pending'
        }

        return {
          success: true,
          status,
          transaction: {
            id: transaction_id,
            status,
            paid_at: result.time_end ? this.parseWechatTime(result.time_end) : null,
            provider_transaction_id: result.transaction_id
          } as any
        }
      } else {
        return {
          success: false,
          error: result.err_code_des || result.return_msg || 'Payment verification failed'
        }
      }
    } catch (error) {
      console.error('WeChat verifyPayment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      }
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const refundAmount = request.amount || 0
      const nonceStr = this.generateNonceStr()
      const outRefundNo = `REFUND_${Date.now()}`
      
      // Prepare refund parameters
      const params = {
        appid: this.config.app_id,
        mch_id: this.config.mch_id,
        nonce_str: nonceStr,
        out_trade_no: request.transaction_id,
        out_refund_no: outRefundNo,
        total_fee: Math.round(refundAmount * 100), // This should be original amount
        refund_fee: Math.round(refundAmount * 100),
        refund_desc: request.reason || '用户申请退款',
        sign: ''
      }

      // Generate signature
      params.sign = this.generateSign(params)

      // Convert to XML
      const xmlData = this.buildXML(params)

      // Make API request (requires client certificate)
      const response = await fetch('https://api.mch.weixin.qq.com/secapi/pay/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml'
        },
        body: xmlData
        // Note: In production, you need to add client certificate for this API
      })

      const responseText = await response.text()
      const result = this.parseXML(responseText)

      if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
        return {
          success: true,
          refund_id: result.out_refund_no
        }
      } else {
        return {
          success: false,
          error: result.err_code_des || result.return_msg || 'Refund failed'
        }
      }
    } catch (error) {
      console.error('WeChat processRefund error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      }
    }
  }

  async handleWebhook(payload: any): Promise<{ success: boolean; transaction_id?: string }> {
    try {
      // Parse XML payload
      const data = this.parseXML(payload)

      // Verify signature
      const isValid = this.verifyWebhookSignature(data)
      if (!isValid) {
        return { success: false }
      }

      const transactionId = data.out_trade_no
      const resultCode = data.result_code

      // Process webhook based on result
      if (resultCode === 'SUCCESS') {
        return {
          success: true,
          transaction_id: transactionId
        }
      }

      return { success: true }
    } catch (error) {
      console.error('WeChat handleWebhook error:', error)
      return { success: false }
    }
  }

  private generateNonceStr(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private generateSign(params: Record<string, any>): string {
    // Remove sign and empty values
    const filteredParams = Object.keys(params)
      .filter(key => key !== 'sign' && params[key] !== '' && params[key] != null)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key]
        return obj
      }, {} as Record<string, any>)

    // Build query string
    const queryString = Object.keys(filteredParams)
      .map(key => `${key}=${filteredParams[key]}`)
      .join('&')

    // Add API key
    const stringSignTemp = `${queryString}&key=${this.config.api_key}`

    // Generate MD5 hash
    return crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase()
  }

  private buildXML(params: Record<string, any>): string {
    let xml = '<xml>'
    Object.keys(params).forEach(key => {
      xml += `<${key}><![CDATA[${params[key]}]]></${key}>`
    })
    xml += '</xml>'
    return xml
  }

  private parseXML(xml: string): Record<string, any> {
    const result: Record<string, any> = {}
    const regex = /<(\w+)><!\[CDATA\[(.*?)\]\]><\/\1>/g
    let match

    while ((match = regex.exec(xml)) !== null) {
      result[match[1]] = match[2]
    }

    return result
  }

  private parseWechatTime(timeStr: string): string {
    // WeChat time format: yyyyMMddHHmmss
    const year = timeStr.substring(0, 4)
    const month = timeStr.substring(4, 6)
    const day = timeStr.substring(6, 8)
    const hour = timeStr.substring(8, 10)
    const minute = timeStr.substring(10, 12)
    const second = timeStr.substring(12, 14)
    
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`).toISOString()
  }

  private verifyWebhookSignature(data: Record<string, any>): boolean {
    try {
      const sign = data.sign
      delete data.sign

      const generatedSign = this.generateSign(data)
      return sign === generatedSign
    } catch (error) {
      console.error('WeChat signature verification error:', error)
      return false
    }
  }
}
