from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet

router = DefaultRouter()
router.register(r'', ClientViewSet, basename='clients')  # Базовий шлях буде /api/clients/

# Додаткові кастомні ендпоінти
urlpatterns = [
    path('active/', ClientViewSet.as_view({'get': 'active_clients'}), name='active-clients'),
    path('', include(router.urls)),
]
