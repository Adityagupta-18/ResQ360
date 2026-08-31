from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self,email,password,full_name,account_type):
        if not email:
            raise ValueError("Email is required")
        email=self.normalize_email(email).strip()

        if not password:
            raise ValueError("Password is required")
        
        user=self.model(email=email,full_name=full_name,account_type=account_type)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,password,full_name,account_type):
        user=self.create_user(email=email,full_name=full_name,account_type=account_type,password=password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)   

        return user