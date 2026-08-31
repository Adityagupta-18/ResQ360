from django.urls import path
from .views import CustomUserView, UserRegistrationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
    
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', CustomUserView.as_view(), name='custom-user-view')
]