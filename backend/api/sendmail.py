import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from api.core.settings import settings

FORMAT = "[%(asctime)s:%(filename)s:%(lineno)s - %(funcName)20s() ] %(message)s"
logging.basicConfig(level=logging.INFO, format=FORMAT)


def send_mail(to: str, subject: str, message: str) -> None:
    if not settings.smtp_host or not settings.smtp_port:
        logging.error("missing smtp config")
        return
    msg = MIMEMultipart("mixed")

    msg["Subject"] = subject
    msg["From"] = settings.MAIL_FROM
    msg["To"] = to

    html = message + '<!--|{"tags":["signup"],"textversion":1}|-->'

    part1 = MIMEText(html, "html")

    msg.attach(part1)
    s = smtplib.SMTP(settings.smtp_host, settings.smtp_port)

    s.set_debuglevel(True)

    if "maildev" not in settings.smtp_host:
        s.starttls()

    if settings.smtp_user and settings.smtp_pass:
        s.login(settings.smtp_user, settings.smtp_pass)
    try:
        s.sendmail(msg["From"], msg["To"], msg.as_string())
    except Exception as e:
        logging.error("send mail error", e)
    finally:
        s.quit()
