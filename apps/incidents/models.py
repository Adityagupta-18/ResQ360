import uuid

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

    def __str__(self):
        return self.emergency_id or str(self.id)