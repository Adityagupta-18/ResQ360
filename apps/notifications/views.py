from django.db import models
from django.shortcuts import render
from rest_framework.views import APIView
from apps.notifications.models import Notification
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import NotificationSerializer

# Create your views here.

class NotificationReadView(APIView):
    def post(self,request,notification_id):
        notification=get_object_or_404(Notification,id=notification_id)
        if (notification.organization
            and notification.organization.owner == request.user) or (
            notification.volunteer and notification.volunteer == request.user
            ):
            notification.is_read = True
            notification.save()
            return Response(
                {"message": "Notification marked as read."},
                status=status.HTTP_200_OK
            )

        return Response(
            {"error": "You are not the recipient of this notification."},
            status=status.HTTP_403_FORBIDDEN
        )


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(
            models.Q(organization__owner=request.user) |
            models.Q(volunteer=request.user)
        ).order_by("-created_at")

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)