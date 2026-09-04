from django.urls import path
from apps.organizations.views import OrganizationRegistrationView , OrganizationProfileView

urlpatterns = [
    path('register/', OrganizationRegistrationView.as_view(), name='organization-registration'),
    path('me/',OrganizationProfileView.as_view() , name='Organization-Profile')
]