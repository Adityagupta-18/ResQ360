from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'account_type']

    def create(self, validated_data):
        return User.objects.create_user(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            password=validated_data['password'],
            account_type=validated_data['account_type']
        )

    def validate_account_type(self, value):
        if value != 'VOL':
            raise serializers.ValidationError("Only volunteers can register here.")
        return value


class VolunteerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","full_name","email","account_type",]
        read_only_fields = [
            "id",
            "email",
            "account_type",
        ]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.account_type == 'ORG':
            organization = self.user.organization

            if organization.verification_status == 'PEND':
                raise serializers.ValidationError({
                    "verification_status": "PEND",
                    "message": "Organization verification is pending.",
                    "organization_name": organization.name,
                    "organization_type": organization.get_organization_type_display()
                })

            if organization.verification_status == 'REJ':
                raise serializers.ValidationError({
                    "verification_status": "REJ",
                    "message": "Organization registration has been rejected.",
                    "organization_name": organization.name,
                    "organization_type": organization.get_organization_type_display()
                })

        return data