import asyncio
import os

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo
)
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL")

bot = Bot(token=TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message):
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="ОТКРЫТЬ OFFICIAL APP",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ]
    )

    await message.answer(
        "m4rs1anen — OFFICIAL\n\n"
        "Добро пожаловать в мой мир.\n"
        "Музыка, мерч, релизы и новости.",
        reply_markup=keyboard
    )


async def main():
    print("m4rs1anen bot is running...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
