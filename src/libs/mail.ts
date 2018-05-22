import nodemailer from 'nodemailer'
import config from 'config'
import { EmailOption } from '@types'

const emailConfig: Config.email = config.get('email')
const transporter = nodemailer.createTransport(emailConfig.transporter)
const emailSendENV: Array<String> = config.get('emailSendENV')

export default {
  async send(options: EmailOption) {
    if (!emailSendENV.includes(process.env.NODE_ENV as String)) {
      return
    }
    try {
      // 设置邮件内容（谁发送什么给谁）
      const emailOptions = {
        from: emailConfig.transporter.auth.user, // 发件人
        ...options,
      }
      // 使用先前创建的传输器的 sendMail 方法传递消息对象
      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          return console.log('邮件发送失败:', error)
        }
        console.log(`邮件发送成功: ${options.to}-${options.subject}`)
      })
    } catch (e) {
      console.log('邮件发送失败:', e)
    }
  },
}
