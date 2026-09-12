from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    emergency_id = serializers.CharField(
        source="incident.emergency_id",
        read_only=True
    )
    class Meta:
        model = Notification
        fields = [
            "id",
            "incident",
            "emergency_id",
            "message",
            "is_read",
            "created_at",
        ]