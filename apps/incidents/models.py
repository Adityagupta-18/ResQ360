import uuid
from apps.organizations.models import Organization
from apps.users.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Incident(models.Model):

    class IncidentType(models.TextChoices):
        ACCIDENT = "ACCIDENT", "Accident"
        MEDICAL = "MEDICAL", "Medical"
        FIRE = "FIRE", "Fire"
        CRIME_SECURITY = "CRIME_SECURITY", "Crime/Security"
        MISSING_PERSON = "MISSING_PERSON", "Missing Person"
        BLOOD_BANK = "BLOOD_BANK", "Blood Bank"

    class Severity(models.TextChoices):
        CRITICAL = "CRITICAL", "Critical"
        SERIOUS = "SERIOUS", "Serious"
        MINOR = "MINOR", "Minor"
        UNKNOWN = "UNKNOWN", "Unknown"
            
    class Status(models.TextChoices):
        REPORTED = "REPORTED", "Reported"
        MATCHING = "MATCHING", "Matching"
        ALERTING = "ALERTING", "Alerting Responders"
        ACCEPTED = "ACCEPTED", "Accepted"
        ENROUTE = "ENROUTE", "Enroute"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        RESOLVED = "RESOLVED", "Resolved"

    # Internal database identity
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    # Citizen-facing emergency reference
    emergency_id = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
    )

    # Basic emergency information
    incident_type = models.CharField(
        max_length=30,
        choices=IncidentType.choices,
    )

    # Location
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[
            MinValueValidator(-90),
            MaxValueValidator(90),
        ],
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        validators=[
            MinValueValidator(-180),
            MaxValueValidator(180),
        ],
    )

    location_address = models.CharField(max_length=255,blank=True,)

    # Incident details
    people_affected = models.PositiveIntegerField(default=1)
    severity = models.CharField(max_length=10,choices=Severity.choices,null=True,blank=True,)
    road_blocked = models.BooleanField(null=True,blank=True,)
    fire_smoke = models.BooleanField(null=True,blank=True,)
    severe_bleeding = models.BooleanField(null=True,blank=True,)
    person_trapped = models.BooleanField(null=True,blank=True,)

    # Lifecycle
    status = models.CharField(max_length=20,choices=Status.choices,default=Status.REPORTED,)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True,)
    updated_at = models.DateTimeField(auto_now=True,)


    def generate_emergency_id(self):
        while True:
            emergency_id = f"EMG-{uuid.uuid4().hex[:6].upper()}"

            if not Incident.objects.filter(emergency_id=emergency_id).exists():
                self.emergency_id = emergency_id
                return emergency_id


    def get_required_organization_types(self):
        mapping={
            "ACCIDENT":['MED','POLICE_SECURITY','NGO'],
            "MEDICAL":['MED','NGO'],
            "FIRE":['FIRE_RESCUE','POLICE_SECURITY','NGO'],
            "CRIME_SECURITY":['POLICE_SECURITY'],
            "MISSING_PERSON":['POLICE_SECURITY'],
            "BLOOD_BANK":['MED','NGO']
        }
        return mapping[self.incident_type]


    def should_notify_volunteers(self):
        mapping={
            "ACCIDENT":True,
            "MEDICAL":True,
            "FIRE":True,
            "CRIME_SECURITY":True,
            "MISSING_PERSON":False,
            "BLOOD_BANK":True
        }
        return mapping[self.incident_type]


    def __str__(self):
        return self.emergency_id or str(self.id)



class IncidentOrganization(models.Model):
    STATUS_CHOICE=[
        ('NOTIFIED','Notified'),
        ('ACCEPTED','Accepted')
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident=models.ForeignKey(Incident,on_delete=models.CASCADE,related_name='incident_organizations')
    organization=models.ForeignKey(Organization,on_delete=models.CASCADE,related_name='incident_organizations')
    status=models.CharField(max_length=10,choices=STATUS_CHOICE,default='NOTIFIED')
    notified_at = models.DateTimeField(null=True, blank=True)
    accepted_at = models.DateTimeField(null=True, blank=True)


    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["incident", "organization"],
                name="unique_incident_organization"
            )
        ]


class IncidentVolunteer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    incident=models.ForeignKey(Incident,on_delete=models.CASCADE,related_name='incident_volunteers')
    volunteer=models.ForeignKey(User,on_delete=models.CASCADE,related_name='incident_volunteers')
    notified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["incident", "volunteer"],
                name="unique_incident_volunteer",
            )
        ]

