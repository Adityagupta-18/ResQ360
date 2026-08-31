from django.shortcuts import render
from rest_framework import generics
import rest_framework
from rest_framework.permissions import AllowAny
from apps.users.permissions import IsOrganization ,IsVolunteer
from .serializers import UserRegistrationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class CustomUserView(APIView):
    def get(self, request):
        user=request.user
        return Response({"message": "Hello, this is a custom user view!","full_name": user.full_name, "email": user.email , "account_type": user.account_type})
