from django.urls import path
from apps.organizations.views import OrganizationRegistrationView , OrganizationProfileView
from apps.incidents.views import IncidentOrganizationListView

urlpatterns = [
    path('register/', OrganizationRegistrationView.as_view(), name='organization-registration'),
    path('me/',OrganizationProfileView.as_view() , name='Organization-Profile'),
    path("incidents/",IncidentOrganizationListView.as_view(),name="organization-incidents")
]