from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet

router = DefaultRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')

urlpatterns = [
    # Кастомний маршрут для фільтрації по типу
    path('vehicles/filter-by-type/<str:type>/',
         VehicleViewSet.as_view({'get': 'by_type'}),
         name='vehicle-by-type'),
] + router.urls