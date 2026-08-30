from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self,email,password,full_name,account_type):
        email=self.normalize_email(email)
        user=self.model(email=email,full_name=full_name,account_type=account_type)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self,email,password,full_name,account_type):
        user=self.model(email=email,full_name=full_name,account_type=account_type)
        user.set_password(password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)   

        return user