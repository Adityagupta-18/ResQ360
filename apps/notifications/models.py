from django.db import models
import uuid
from apps.incidents.models import Incident
from apps.organizations.models import Organization
from apps.users.models import User
# Create your models here.

class Notification(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    incident=models.ForeignKey(Incident,on_delete=models.CASCADE,related_name="notifications")
    organization=models.ForeignKey(Organization,on_delete=models.CASCADE,null=True,blank=True,related_name="notifications")
    volunteer=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True,related_name="notifications")
    message=models.CharField(max_length=255)
    is_read=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(organization__isnull=False, volunteer__isnull=True)
                    | models.Q(organization__isnull=True, volunteer__isnull=False)
                ),
                name="notification_one_recipient",
            )
        ]