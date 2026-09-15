from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Organization


@receiver(post_delete, sender=Organization)
def delete_verification_document(sender, instance, **kwargs):
    if instance.verification_document:
        instance.verification_document.delete(save=False)