from django.shortcuts import render
from rest_framework import generics
import rest_framework
from rest_framework.permissions import AllowAny , IsAuthenticated
from apps.users.permissions import IsOrganization ,IsVolunteer
from .serializers import UserRegistrationSerializer , VolunteerProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


class CustomUserView(APIView):
    def get(self, request):
        user=request.user
        return Response({"message": "Hello, this is a custom user view!","full_name": user.full_name, "email": user.email , "account_type": user.account_type})


class VolunteerProfileView(APIView):
    permission_classes = [IsAuthenticated, IsVolunteer]

    def get(self, request):
        serializer = VolunteerProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = VolunteerProfileSerializer(
            request.user,
            data=request.data,
            partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


def login_page(request):
    return render(request, "users/login.html")


def volunteer_dashboard(request):
    return render(request, "volunteer/dashboard.html")


def volunteer_emergency_detail(request, emergency_id):
    return render(request, "volunteer/emergency_detail.html")