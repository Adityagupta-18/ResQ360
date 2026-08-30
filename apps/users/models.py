from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser , PermissionsMixin
from apps.users.managers import UserManager
# Create your models here.

class User(AbstractBaseUser,PermissionsMixin):

    Account_choices=[
        ('ORG', 'ORGANIZATION'),
        ('VOL', 'VOLUNTEER')
    ]
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    full_name=models.CharField(max_length=100)
    email=models.EmailField(unique=True)
    account_type=models.CharField(max_length=3 , choices=Account_choices)
    is_staff = models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)
    date_joined=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'account_type']
    objects=UserManager()