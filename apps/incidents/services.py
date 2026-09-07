from apps.organizations.models import Organization
from apps.users.models import User
from django.utils import timezone
from .models import IncidentOrganization , IncidentVolunteer

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

    required_vol=incident.should_notify_volunteers()
    if required_vol:
        volunteer_queryset = User.objects.filter(account_type="VOL",is_active=True,)

        for volunteer in volunteer_queryset:
            if IncidentVolunteer.objects.filter(incident=incident,volunteer=volunteer).exists():
                continue
            IncidentVolunteer.objects.create(
                incident=incident,
                volunteer=volunteer,
                notified_at=timezone.now()
            )