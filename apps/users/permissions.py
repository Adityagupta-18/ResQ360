from rest_framework.permissions import BasePermission

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