from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import IncidentSerializer , IncidentTrackingSerializer
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Incident

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