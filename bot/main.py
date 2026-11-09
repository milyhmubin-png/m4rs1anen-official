import asyncio
import json
import os
import urllib.request
import urllib.parse
import urllib.error
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL")

if not TOKEN or not WEBAPP_URL:
    raise SystemExit("Проверь BOT_TOKEN и WEBAPP_URL в .env")

API = f"https://api.telegram.org/bot{TOKEN}/"


def telegram_request(method, data=None):
    encoded = urllib.parse.urlencode(data or {}).encode()
    request = urllib.request.Request(API + method, data=encoded)
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode())


def handle_message(message):
    chat_id = message["chat"]["id"]

    if message.get("text") == "/start":
        keyboard = {
            "inline_keyboard": [[
                {
                    "text": "ОТКРЫТЬ OFFICIAL APP",
                    "web_app": {"url": WEBAPP_URL}
                }
            ]]
        }

        telegram_request("sendMessage", {
            "chat_id": chat_id,
            "text": "m4rs1anen — OFFICIAL\n\n"
                    "Добро пожаловать в мой мир.\n"
                    "Музыка, мерч, релизы и новости.",
            "reply_markup": json.dumps(keyboard)
        })


async def main():
    print("m4rs1anen bot is running...")
    offset = 0

    while True:
        try:
            updates = await asyncio.to_thread(
                telegram_request,
                "getUpdates",
                {"offset": offset, "timeout": 50}
            )

            for update in updates.get("result", []):
                offset = update["update_id"] + 1
                message = update.get("message")

                if message:
                    await asyncio.to_thread(handle_message, message)

        except urllib.error.HTTPError as error:
            print("ОШИБКА TELEGRAM:", error.code, error.read().decode())
            await asyncio.sleep(5)
        except Exception as error:
            print("ОШИБКА:", repr(error))
            await asyncio.sleep(5)


if __name__ == "__main__":
    asyncio.run(main())
