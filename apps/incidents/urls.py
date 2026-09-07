from django.urls import path
from .views import IncidentCreateView , IncidentTrackingView , IncidentOrganizationAcceptView ,IncidentOrganizationEnrouteView

urlpatterns = [
    path('',IncidentCreateView.as_view(), name='incident-create'),
    path('track/<emergency_id>/',IncidentTrackingView.as_view(), name='track-incident'),
    path(
    "organization-assignments/<uuid:incident_organization_id>/accept/",IncidentOrganizationAcceptView.as_view(),name="organization-incident-accept"),
    path("organization-assignments/<uuid:incident_organization_id>/enroute/",IncidentOrganizationEnrouteView.as_view(),
    name="organization-incident-enroute"),
]