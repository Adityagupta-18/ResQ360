from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Organization
from apps.users.models import User


@receiver(post_delete, sender=Organization)
def cleanup_organization(sender, instance, **kwargs):

    if instance.verification_document:
        instance.verification_document.delete(save=False)

    User.objects.filter(
        pk=instance.owner_id
    ).delete()