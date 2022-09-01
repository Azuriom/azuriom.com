---
title: 邮件
---

# 发送邮件

Azuriom 支持两种向用户发送邮件的方法: Sendmail 和 SMTP.

Sendmail 更容易使用和安装, 但其发送的邮件也更容易被认定为垃圾邮件.

## SMTP 服务器

{{< info >}}
原文档所提到的服务在中国大陆可能无法使用, 故此处提供了中文版本专属的内容  
原文请参阅 [英语版本]({{< ref "/en/docs/mails" >}})
{{< /info >}}

一些可用的 SMTP 邮件服务:  
* [QQ邮箱](https://mail.qq.com/): 个人用户免费
* [网易邮箱](https://mail.163.com/): 个人用户免费
* [企业微信邮箱|腾讯企业邮](https://work.weixin.qq.com/mail/): 提供免费版和专业版
或者使用云服务商提供的专业邮件服务:
* [阿里云](https://www.aliyun.com/product/directmail)
* [腾讯云](https://cloud.tencent.com/product/ses)

然后只需要在 Azuriom 邮件设置中选择 SMTP 并填写相关配置项.

## Sendmail

如果你使用的是共享虚拟主机，Sendmail 可能已经安装了
在VPS或专用服务器上，可以用以下命令安装 Sendmail:
```
apt install -y sendmail
```

然后只需要在 Azuriom 邮件设置中选择 Sendmail.
