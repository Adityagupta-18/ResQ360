from django.urls import path
from .views import IncidentCreateView

urlpatterns = [
    path('',IncidentCreateView.as_view(), name='incident-create'),
]