from django.urls import path
from apps.notifications.views import NotificationReadView , NotificationListView


urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("<uuid:notification_id>/read/",NotificationReadView.as_view(),name="notification-read"),
]