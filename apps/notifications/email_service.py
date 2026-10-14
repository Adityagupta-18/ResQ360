
import logging

import sib_api_v3_sdk
from django.conf import settings
from sib_api_v3_sdk.rest import ApiException

logger = logging.getLogger(__name__)


def send_transactional_email(
    *,
    recipient_email,
    subject,
    html_content,
    text_content=None,
):
    """Send a transactional email through Brevo's API."""

    if not settings.BREVO_API_KEY or not settings.BREVO_SENDER_EMAIL:
        logger.error("Brevo email configuration is missing.")
        return False

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = settings.BREVO_API_KEY

    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(configuration)
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": recipient_email}],
        sender={
            "name": settings.BREVO_SENDER_NAME,
            "email": settings.BREVO_SENDER_EMAIL,
        },
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )

    try:
        api_instance.send_transac_email(email)
        return True

    except ApiException:
        logger.exception("Brevo rejected the transactional email request.")
        return False

    except Exception:
        logger.exception("Unexpected error while sending email through Brevo.")
        return False
