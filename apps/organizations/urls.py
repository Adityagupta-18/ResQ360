from django.urls import path
from apps.organizations.views import OrganizationRegistrationView

urlpatterns = [
    path('register/', OrganizationRegistrationView.as_view(), name='organization-registration'),
]