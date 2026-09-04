from rest_framework import serializers
from apps.organizations.models import Organization
from apps.users.models import User
from django.db import transaction


class OrganizationRegistrationSerializer(serializers.Serializer):

    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    name = serializers.CharField(max_length=255)
    organization_type = serializers.ChoiceField(
        choices=Organization.ORGANIZATION_TYPE_CHOICES
    )
    address = serializers.CharField()
    verification_document = serializers.FileField()


    def create(self, validated_data):
        with transaction.atomic():
            user = User.objects.create_user(
                full_name=validated_data['full_name'],
                email=validated_data['email'],
                password=validated_data['password'],
                account_type='ORG'
            )
            organization = Organization.objects.create(
                name=validated_data['name'],
                organization_type=validated_data['organization_type'],
                owner=user,
                address=validated_data['address'],
                verification_document=validated_data['verification_document']
            )
        return organization



class OrganizationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Organization
        fields='__all__'
        read_only_fields = [
            'id',
            'organization_type',
            'verification_status',
            'verification_document',
            'created_at',
            'updated_at',
        ]