from django.shortcuts import render
from rest_framework.views import APIView, Response
from apps.organizations.serializers import OrganizationRegistrationSerializer ,OrganizationProfileSerializer
from rest_framework.permissions import AllowAny , IsAuthenticated
from apps.users.permissions import IsOrganization
# Create your views here.

class OrganizationRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = OrganizationRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            organization = serializer.save()
            return Response({"message": "Organization registered successfully."}, status=201)
        return Response(serializer.errors, status=400)


class OrganizationProfileView(APIView):
    permission_classes=[IsAuthenticated,IsOrganization]

    def get(self,request):
        organization=request.user.organization
        serializer=OrganizationProfileSerializer(organization)
        return Response(serializer.data)

    def patch(self,request):
        org=request.user.organization
        serializer=OrganizationProfileSerializer(org,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        Response(serializer.errors, status=400)
        