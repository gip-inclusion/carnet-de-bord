import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from cdb.api.core.settings import settings


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
    s = smtplib.SMTP(settings.smtp_host, int(settings.smtp_port))

    s.starttls()

    if settings.smtp_user and settings.smtp_pass:
        s.login(settings.smtp_user, settings.smtp_pass)
    try:
        s.sendmail(msg["From"], msg["To"], msg.as_string())
    except smtplib.SMTPRecipientsRefused as err:
        logging.error("sendmail error: %s", err)
    except smtplib.SMTPHeloError as err:
        logging.error("sendmail error: %s", err)
    except smtplib.SMTPSenderRefused as err:
        logging.error("sendmail error: %s", err)
    except smtplib.SMTPDataError as err:
        logging.error("sendmail error: %s", err)
    except smtplib.SMTPNotSupportedError as err:
        logging.error("sendmail error %s", err)
    finally:
        s.quit()
