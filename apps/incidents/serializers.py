from rest_framework import serializers
from .models import Incident , IncidentOrganization
from .services import dispatch_incident

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Incident
        fields='__all__'
        read_only_fields =[
            'id',
            'emergency_id',
            'status',
            'created_at',
            'updated_at',
        ]

    def create(self, validated_data):
        incident = Incident.objects.create(**validated_data)
        incident.generate_emergency_id()
        incident.save()
        dispatch_incident(incident)
        return incident


class IncidentTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Incident
        fields=['emergency_id','incident_type','severity','people_affected','location_address','created_at','status']


class IncidentOrganizationSerializer(serializers.ModelSerializer):

    emergency_id = serializers.CharField(source="incident.emergency_id",read_only=True)
    incident_type = serializers.CharField(source="incident.incident_type",read_only=True)
    severity = serializers.CharField(source="incident.severity",read_only=True)
    people_affected = serializers.IntegerField(source="incident.people_affected",read_only=True)
    location_address = serializers.CharField(source="incident.location_address",read_only=True)
    latitude = serializers.DecimalField(source="incident.latitude",max_digits=9,decimal_places=6,read_only=True)
    longitude = serializers.DecimalField(source="incident.longitude",max_digits=9,decimal_places=6,read_only=True)
    status = serializers.CharField(source="incident.status",read_only=True)
    created_at = serializers.DateTimeField(source="incident.created_at",read_only=True)
    response_status = serializers.CharField(source="status",read_only=True)

    class Meta:
        model = IncidentOrganization
        fields = ["id","emergency_id","incident_type","severity","people_affected","location_address",
            "latitude","longitude","status","created_at","response_status",
            ]