from apps.organizations.models import Organization
from django.utils import timezone
from .models import IncidentOrganization

def dispatch_incident(incident):
    required_types = incident.get_required_organization_types()
    queryset=Organization.objects.filter(organization_type__in=required_types,verification_status='VERIF')

    for organization in queryset:
        if IncidentOrganization.objects.filter(incident=incident,organization=organization).exists():
            continue
        IncidentOrganization.objects.create(
            incident=incident,
            organization=organization,
            status="NOTIFIED",
            notified_at=timezone.now(),
        )