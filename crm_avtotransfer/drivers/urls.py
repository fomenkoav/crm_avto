from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DriverViewSet

router = DefaultRouter()
router.register(r'drivers', DriverViewSet, basename='driver')

custom_urlpatterns = [
    path('drivers/available/',
         DriverViewSet.as_view({'get': 'list_available'}),
         name='driver-available'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('', include(custom_urlpatterns)),
]