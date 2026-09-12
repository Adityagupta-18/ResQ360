from django.shortcuts import render
from rest_framework.views import APIView     
from .serializers import IncidentSerializer , IncidentTrackingSerializer , IncidentOrganizationSerializer
from rest_framework import status , generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Incident , IncidentOrganization
from apps.users.permissions import IsVerifiedOrganization
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

class IncidentCreateView(APIView):
    permission_classes=[AllowAny,]
    
    def post(self,request):
        serializer=IncidentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class IncidentTrackingView(APIView):
    permission_classes=[AllowAny,]

    def get(self,request,emergency_id):
        incident=get_object_or_404(Incident,emergency_id=emergency_id)
        serializer=IncidentTrackingSerializer(incident)
        return Response(serializer.data,status=status.HTTP_200_OK)  


class IncidentOrganizationListView(generics.ListAPIView):
    permission_classes=[IsVerifiedOrganization]
    serializer_class=IncidentOrganizationSerializer

    def get_queryset(self):
        return IncidentOrganization.objects.filter(
            organization=self.request.user.organization
        )

class IncidentOrganizationAcceptView(APIView):
    permission_classes=[IsVerifiedOrganization]

    def post(self,request,incident_organization_id):
        with transaction.atomic():
            assignment = get_object_or_404(
                IncidentOrganization.objects.select_for_update(),
                id=incident_organization_id,
                organization=request.user.organization
            )

        already_accepted = IncidentOrganization.objects.filter(incident=assignment.incident,status="ACCEPTED"
            ).exclude(id=assignment.id).exists()
        
        if already_accepted:
            return Response(
                {"error": "Emergency already accepted by another organization."},
                status=status.HTTP_409_CONFLICT)
        
        assignment.status = "ACCEPTED"
        assignment.accepted_at = timezone.now()
        assignment.save()

        assignment.incident.status = "ACCEPTED"
        assignment.incident.save()

        serializer = IncidentOrganizationSerializer(assignment)
        return Response(serializer.data,status=status.HTTP_200_OK)


class IncidentOrganizationEnrouteView(APIView):
    permission_classes=[IsVerifiedOrganization]

    def post(self,request,incident_organization_id):
        assignment=get_object_or_404(IncidentOrganization,id=incident_organization_id,organization=request.user.organization)

        if assignment.status == "ACCEPTED":
            assignment.incident.status = "ENROUTE"
            assignment.incident.save()

            serializer=IncidentOrganizationSerializer(assignment)
            return Response(serializer.data,status=status.HTTP_200_OK)

        return Response(
            {"error": "Organization must accept the emergency first."},
            status=status.HTTP_400_BAD_REQUEST)


class IncidentOrganizationInProgressView(APIView):
    permission_classes=[IsVerifiedOrganization]

    def post(self,request,incident_organization_id):
        assignment=get_object_or_404(IncidentOrganization,id=incident_organization_id,organization=request.user.organization)

        if assignment.status == "ACCEPTED" and assignment.incident.status == "ENROUTE":
            assignment.incident.status = "IN_PROGRESS"
            assignment.incident.save()

            serializer=IncidentOrganizationSerializer(assignment)
            return Response(serializer.data,status=status.HTTP_200_OK)

        return Response(
            {"error": "Emergency must be ENROUTE before marking it IN_PROGRESS."},
            status=status.HTTP_400_BAD_REQUEST)


class IncidentOrganizationResolvedView(APIView):
    permission_classes=[IsVerifiedOrganization]

    def post(self,request,incident_organization_id):
        assignment=get_object_or_404(IncidentOrganization,id=incident_organization_id,organization=request.user.organization)

        if assignment.status == "ACCEPTED" and assignment.incident.status == "IN_PROGRESS":
            assignment.incident.status = "RESOLVED"
            assignment.incident.save()

            serializer=IncidentOrganizationSerializer(assignment)
            return Response(serializer.data,status=status.HTTP_200_OK)

        return Response(
            {"error": "Emergency must be IN_PROGRESS before marking it as RESOLVED."},
            status=status.HTTP_400_BAD_REQUEST)