import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту info@banibochka.kz"""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()

    if not name or not phone:
        return {
            "statusCode": 400,
            "headers": cors_headers,
            "body": json.dumps({"error": "Имя и телефон обязательны"}, ensure_ascii=False),
        }

    smtp_host = os.environ["SMTP_HOST"]
    smtp_user = os.environ["SMTP_USER"]
    smtp_pass = os.environ["SMTP_PASS"]
    to_email = "info@banibochka.kz"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая заявка с сайта: {name}"
    msg["From"] = smtp_user
    msg["To"] = to_email

    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; padding: 24px; background: #f5ede0; border-radius: 12px;">
        <h2 style="color: #5c3a1e; margin-bottom: 16px;">🌲 Новая заявка с сайта Баника</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Имя</td>
                <td style="padding: 8px 0; font-weight: bold; color: #3d2010;">{name}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #888; font-size: 14px;">Телефон</td>
                <td style="padding: 8px 0; font-weight: bold; color: #3d2010;">
                    <a href="tel:{phone}" style="color: #5a7a2e;">{phone}</a>
                </td>
            </tr>
        </table>
        <p style="margin-top: 20px; font-size: 13px; color: #aaa;">Заявка отправлена с сайта banibochka.kz</p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL(smtp_host, 465) as server:
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"success": True}),
    }