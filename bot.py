import telebot
import google.generativeai as genai
from telebot import util

# --- CONFIGURATION ---
TELEGRAM_TOKEN = "8089170415:AAHQFKU_9VZWJJBrvocndk0-sgmkoSF79GY"
GEMINI_API_KEY = "AIzaSyD0UsNgwZvTKGCAY5iyMHYakRVK871_6_Q"

# AI Model Setup
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# Memory store: Har user ki chat history alag save hogi
user_chat_history = {}

bot = telebot.TeleBot(TELEGRAM_TOKEN)

@bot.message_handler(commands=['start', 'reset'])
def send_welcome(message):
    user_id = message.from_user.id
    user_chat_history[user_id] = model.start_chat(history=[]) # History reset
    
    welcome_text = (
        "🚀 **REEXAMINE AI PRO v2.0**\n\n"
        "Main ab pehle se zyada samajhdar hoon! Main aapki purani baatein yaad rakh sakta hoon.\n\n"
        "💬 Mujhse baatein shuru karein!\n"
        "🔄 `/reset` - Agar aap purani baat khatam karke naya topic shuru karna chahte hain."
    )
    bot.reply_to(message, welcome_text, parse_mode="Markdown")

@bot.message_handler(func=lambda message: True)
def ai_chat(message):
    user_id = message.from_user.id
    
    # Agar user naya hai to uski history initialize karein
    if user_id not in user_chat_history:
        user_chat_history[user_id] = model.start_chat(history=[])

    try:
        bot.send_chat_action(message.chat.id, 'typing')
        
        # AI se answer mangna (History ke sath)
        response = user_chat_history[user_id].send_message(message.text)
        
        # Lambay messages ko handle karna (Split if text > 4000 chars)
        if len(response.text) > 4000:
            splitted_text = util.smart_split(response.text, chars_per_string=3000)
            for text in splitted_text:
                bot.reply_to(message, text)
        else:
            bot.reply_to(message, response.text)
            
    except Exception as e:
        print(f"Error logic: {e}")
        bot.reply_to(message, "⚠️ System overload! Thoda break lein aur phir try karein.")

print("🔥 Next Level AI Bot is Online!")
bot.infinity_polling()
      
