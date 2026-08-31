import uuid
from django.db import models

# Create your models here.


class Organization(models.Model):
    ORGANIZATION_TYPE_CHOICES = [
        ('MED', 'Medical'),
        ('FIRE_RESCUE', 'Fire Rescue'),
        ('POLICE_SECURITY', 'Police/Security'),
        ('NGO', 'Non-Governmental Organization')
    ]
    VERIFICATION_STATUS_CHOICES = [
        ('PEND', 'Pending'),
        ('VERIF', 'Verified'),
        ('REJ', 'Rejected'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    organization_type = models.CharField(max_length=20, choices=ORGANIZATION_TYPE_CHOICES)
    owner = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='organization')
    address = models.TextField()
    verification_document = models.FileField(upload_to='verification_documents/')
    verification_status = models.CharField(max_length=5, choices=VERIFICATION_STATUS_CHOICES, default='PEND')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
