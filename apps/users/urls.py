from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import CustomUserView, UserRegistrationView , VolunteerProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
    
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('me/', CustomUserView.as_view(), name='custom-user-view'),
    path("volunteer/me/",VolunteerProfileView.as_view(),name="volunteer-profile"),
]