"""
URL configuration for ResQ360 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from apps.users.views import login_page , volunteer_dashboard , volunteer_emergency_detail
from apps.organizations.views import organization_dashboard ,emergency_detail
from apps.incidents.views import citizen_home , track_incident , track_emergency , nearby_help , incident_type ,incident_details,incident_review , citizen_location ,incident_confirmation

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/organizations/', include('apps.organizations.urls')),
    path('api/v1/incidents/', include('apps.incidents.urls')),
    path("api/v1/notifications/",include("apps.notifications.urls")),
    path("login/", login_page, name="login-page"),
    path("organization/dashboard/", organization_dashboard, name="organization-dashboard"),
    path("organization/emergency/<str:emergency_id>/", emergency_detail, name="emergency-detail"),
    path("volunteer/dashboard/", volunteer_dashboard, name="volunteer-dashboard"),
    path("volunteer/emergency/<str:emergency_id>/",volunteer_emergency_detail,name="volunteer-emergency-detail"),
    path("", citizen_home, name="citizen-home"),
    path("nearby-help", nearby_help, name="nearby-help"),
    path("track-incident", track_incident, name="track-incident"),
    path("track-emergency", track_emergency, name="track-emergency"),
    path("incident-type", incident_type, name="incident-type"),
    path("citizen-location", citizen_location, name="citizen-location"),
    path("incident-details", incident_details, name="incident-details"),
    path("incident-review", incident_review, name="incident-review"),
    path("incident-confirmation", incident_confirmation, name="incident-confirmation"),
    ]
