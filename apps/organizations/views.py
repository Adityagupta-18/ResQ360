from django.shortcuts import render
from rest_framework.views import APIView, Response
from apps.organizations.serializers import OrganizationRegistrationSerializer
from rest_framework.permissions import AllowAny

# Create your views here.

class OrganizationRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = OrganizationRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            organization = serializer.save()
            return Response({"message": "Organization registered successfully."}, status=201)
        return Response(serializer.errors, status=400)
