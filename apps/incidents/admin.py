from django.contrib import admin
from .models import Incident , IncidentOrganization , IncidentVolunteer

# Register your models here.

admin.site.register(Incident)
admin.site.register(IncidentOrganization)
admin.site.register(IncidentVolunteer)