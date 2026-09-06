from rest_framework import serializers
from .models import Incident
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