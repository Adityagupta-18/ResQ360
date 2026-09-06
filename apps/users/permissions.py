from rest_framework.permissions import BasePermission
from apps.organizations.models import Organization

class IsOrganization(BasePermission):
    def has_permission(self, request, view):
        user=request.user
        if user.account_type == 'ORG':
            return True
        return False

class IsVolunteer(BasePermission):
    def has_permission(self, request, view):
        user=request.user
        if user.account_type == 'VOL':
            return True
        return False

class IsVerifiedOrganization(BasePermission):
    def has_permission(self, request, view):
        user=request.user
        if user.account_type!='ORG':
            return False
        
        try:
            organization = user.organization
        except Organization.DoesNotExist:
            return False

        if organization.verification_status == 'VERIF':
            return True

        return False