from django.urls import path
from apps.notifications.views import NotificationReadView


urlpatterns = [
    path("<uuid:notification_id>/read/",NotificationReadView.as_view(),name="notification-read"),
]