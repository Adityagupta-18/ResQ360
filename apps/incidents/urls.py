from django.urls import path
from .views import IncidentCreateView , IncidentTrackingView

urlpatterns = [
    path('',IncidentCreateView.as_view(), name='incident-create'),
    path('track/<emergency_id>/',IncidentTrackingView.as_view(), name='track-incident'),
]