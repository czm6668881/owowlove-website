import crypto from 'crypto'
import { 
  PaymentProvider, 
  CreatePaymentRequest, 
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse,
  AlipayConfig,
  AlipayPaymentData
} from '@/lib/types/payment'

export class AlipayProvider implements PaymentProvider {
  name = 'alipay'
  private config: AlipayConfig

  constructor(config: AlipayConfig) {
    this.config = config
  }

  async createPayment(request: CreatePaymentRequest & { transaction_id?: string }): Promise<CreatePaymentResponse> {
    try {
      const outTradeNo = request.transaction_id || `ORDER_${Date.now()}`
      
      // Prepare payment parameters
      const params = {
        app_id: this.config.app_id,
        method: 'alipay.trade.page.pay',
        charset: 'utf-8',
        sign_type: 'RSA2',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: '1.0',
        notify_url: this.config.notify_url,
        return_url: request.return_url || this.config.return_url,
        biz_content: JSON.stringify({
          out_trade_no: outTradeNo,
          product_code: 'FAST_INSTANT_TRADE_PAY',
          total_amount: request.amount.toFixed(2),
          subject: `订单支付 - ${outTradeNo}`,
          body: `订单号: ${request.order_id}`,
          timeout_express: '30m'
        })
      }

      // Generate signature
      const sign = this.generateSign(params)
      params.sign = sign

      // Create payment URL
      const paymentUrl = `${this.config.gateway_url}?${this.buildQuery(params)}`

      return {
        success: true,
        transaction_id: outTradeNo,
        payment_url: paymentUrl,
        payment_data: {
          out_trade_no: outTradeNo,
          total_amount: request.amount.toFixed(2),
          subject: `订单支付 - ${outTradeNo}`
        }
      }
    } catch (error) {
      console.error('Alipay createPayment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      }
    }
  }

  async verifyPayment(transaction_id: string): Promise<PaymentStatusResponse> {
    try {
      // Prepare query parameters
      const params = {
        app_id: this.config.app_id,
        method: 'alipay.trade.query',
        charset: 'utf-8',
        sign_type: 'RSA2',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: '1.0',
        biz_content: JSON.stringify({
          out_trade_no: transaction_id
        })
      }

      // Generate signature
      const sign = this.generateSign(params)
      params.sign = sign

      // Make API request
      const response = await fetch(this.config.gateway_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this.buildQuery(params)
      })

      const responseText = await response.text()
      const result = this.parseResponse(responseText)

      if (result.code === '10000') {
        const tradeStatus = result.trade_status
        let status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'

        switch (tradeStatus) {
          case 'TRADE_SUCCESS':
          case 'TRADE_FINISHED':
            status = 'completed'
            break
          case 'WAIT_BUYER_PAY':
            status = 'pending'
            break
          case 'TRADE_CLOSED':
            status = 'cancelled'
            break
          default:
            status = 'failed'
        }

        return {
          success: true,
          status,
          transaction: {
            id: transaction_id,
            status,
            paid_at: result.send_pay_date || null,
            provider_transaction_id: result.trade_no
          } as any
        }
      } else {
        return {
          success: false,
          error: result.sub_msg || result.msg || 'Payment verification failed'
        }
      }
    } catch (error) {
      console.error('Alipay verifyPayment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      }
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const refundAmount = request.amount || 0
      
      // Prepare refund parameters
      const params = {
        app_id: this.config.app_id,
        method: 'alipay.trade.refund',
        charset: 'utf-8',
        sign_type: 'RSA2',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        version: '1.0',
        biz_content: JSON.stringify({
          out_trade_no: request.transaction_id,
          refund_amount: refundAmount.toFixed(2),
          refund_reason: request.reason || '用户申请退款',
          out_request_no: `REFUND_${Date.now()}`
        })
      }

      // Generate signature
      const sign = this.generateSign(params)
      params.sign = sign

      // Make API request
      const response = await fetch(this.config.gateway_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this.buildQuery(params)
      })

      const responseText = await response.text()
      const result = this.parseResponse(responseText)

      if (result.code === '10000') {
        return {
          success: true,
          refund_id: result.out_request_no
        }
      } else {
        return {
          success: false,
          error: result.sub_msg || result.msg || 'Refund failed'
        }
      }
    } catch (error) {
      console.error('Alipay processRefund error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      }
    }
  }

  async handleWebhook(payload: any): Promise<{ success: boolean; transaction_id?: string }> {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(payload)
      if (!isValid) {
        return { success: false }
      }

      const transactionId = payload.out_trade_no
      const tradeStatus = payload.trade_status

      // Process webhook based on trade status
      if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
        return {
          success: true,
          transaction_id: transactionId
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Alipay handleWebhook error:', error)
      return { success: false }
    }
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
    const queryString = this.buildQuery(filteredParams)

    // Generate RSA2 signature
    const sign = crypto
      .createSign('RSA-SHA256')
      .update(queryString, 'utf8')
      .sign(this.config.private_key, 'base64')

    return sign
  }

  private buildQuery(params: Record<string, any>): string {
    return Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  }

  private parseResponse(responseText: string): any {
    try {
      // Extract JSON from Alipay response format
      const match = responseText.match(/alipay_trade_query_response":(.*?),"sign"/)
      if (match) {
        return JSON.parse(match[1])
      }
      return JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse Alipay response:', error)
      return { code: '40004', msg: 'Invalid response format' }
    }
  }

  private verifyWebhookSignature(payload: any): boolean {
    try {
      const sign = payload.sign
      const signType = payload.sign_type

      if (signType !== 'RSA2') {
        return false
      }

      // Remove sign and sign_type from params
      const params = { ...payload }
      delete params.sign
      delete params.sign_type

      // Build query string for verification
      const queryString = this.buildQuery(params)

      // Verify signature
      const verifier = crypto.createVerify('RSA-SHA256')
      verifier.update(queryString, 'utf8')
      
      return verifier.verify(this.config.public_key, sign, 'base64')
    } catch (error) {
      console.error('Alipay signature verification error:', error)
      return false
    }
  }
}
