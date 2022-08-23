#載入LineBot所需要的模組
from flask import Flask, request, abort
from linebot import (LineBotApi, WebhookHandler)
from linebot.exceptions import (InvalidSignatureError)
from linebot.models import *

app = Flask(__name__)

# 必須放上自己的Channel Access Token
line_bot_api = LineBotApi('KnYYNg15cah1i0Oc2RRadLR0BDcLEROHDJE1F4S/BppzvCYcc3yDQeYTNOEVGN/3SlM1X+U510S4z1m8PuzTk6R8Zn1I5YnILdbuK/kktV1gRhJnltjdyUauKLDhXHXdWjEMKKRQwJ+i3BpAUMHQ7gdB04t89/1O/w1cDnyilFU=')

# 必須放上自己的Channel Secret
handler = WebhookHandler('2507796f7ae93f4797a11c9b5fcba96b')
line_bot_api.push_message('Ub84e35c61ef80aac1f9e2519feba84d5', TextSendMessage(text='你可以開始了'))

# 監聽所有來自 /callback 的 Post Request
@app.route("/callback", methods=['POST'])
def callback():
 # get X-Line-Signature header value
 signature = request.headers['X-Line-Signature']
 # get request body as text
 body = request.get_data(as_text=True)
 app.logger.info("Request body: " + body)

# handle webhook body
try:
handler.handle(body, signature)
except InvalidSignatureError:
abort(400)

return 'OK'

#訊息傳遞區塊
##### 基本上程式編輯都在這個function #####
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
message = TextSendMessage(text=event.message.text)
line_bot_api.reply_message(event.reply_token,message)


#主程式
import os if __name__ == "__main__":
##port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port='5000')