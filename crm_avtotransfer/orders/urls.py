from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

custom_urlpatterns = [
    path('orders/<int:pk>/update-status/',
         OrderViewSet.as_view({'patch': 'partial_update'}),
         name='order-update-status'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('', include(custom_urlpatterns)),
]