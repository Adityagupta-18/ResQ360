from django.contrib import admin
from apps.organizations.models import Organization

# Register your models here.
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'organization_type', 'owner', 'verification_status','created_at')
    list_filter = ('organization_type', 'verification_status')
    search_fields = ('name', 'owner__username', 'owner__email')